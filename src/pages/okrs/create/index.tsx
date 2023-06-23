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
import { createOkr } from 'apiSdk/okrs';
import { Error } from 'components/error';
import { okrValidationSchema } from 'validationSchema/okrs';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { OkrInterface } from 'interfaces/okr';

function OkrCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OkrInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOkr(values);
      resetForm();
      router.push('/okrs');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OkrInterface>({
    initialValues: {
      objective: '',
      key_result: '',
      team_leader_id: (router.query.team_leader_id as string) ?? null,
    },
    validationSchema: okrValidationSchema,
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
            Create Okr
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="objective" mb="4" isInvalid={!!formik.errors?.objective}>
            <FormLabel>Objective</FormLabel>
            <Input type="text" name="objective" value={formik.values?.objective} onChange={formik.handleChange} />
            {formik.errors.objective && <FormErrorMessage>{formik.errors?.objective}</FormErrorMessage>}
          </FormControl>
          <FormControl id="key_result" mb="4" isInvalid={!!formik.errors?.key_result}>
            <FormLabel>Key Result</FormLabel>
            <Input type="text" name="key_result" value={formik.values?.key_result} onChange={formik.handleChange} />
            {formik.errors.key_result && <FormErrorMessage>{formik.errors?.key_result}</FormErrorMessage>}
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
  entity: 'okr',
  operation: AccessOperationEnum.CREATE,
})(OkrCreatePage);
