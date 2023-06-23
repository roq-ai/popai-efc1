import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPerformanceReview } from 'apiSdk/performance-reviews';
import { Error } from 'components/error';
import { performanceReviewValidationSchema } from 'validationSchema/performance-reviews';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PerformanceReviewInterface } from 'interfaces/performance-review';

function PerformanceReviewCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceReviewInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformanceReview(values);
      resetForm();
      router.push('/performance-reviews');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceReviewInterface>({
    initialValues: {
      review_date: new Date(new Date().toDateString()),
      feedback: '',
      team_leader_id: (router.query.team_leader_id as string) ?? null,
      team_member_id: (router.query.team_member_id as string) ?? null,
    },
    validationSchema: performanceReviewValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Performance Review
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="review_date" mb="4">
            <FormLabel>Review Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.review_date ? new Date(formik.values?.review_date) : null}
                onChange={(value: Date) => formik.setFieldValue('review_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="feedback" mb="4" isInvalid={!!formik.errors?.feedback}>
            <FormLabel>Feedback</FormLabel>
            <Input type="text" name="feedback" value={formik.values?.feedback} onChange={formik.handleChange} />
            {formik.errors.feedback && <FormErrorMessage>{formik.errors?.feedback}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'team_leader_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'team_member_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'performance_review',
  operation: AccessOperationEnum.CREATE,
})(PerformanceReviewCreatePage);
