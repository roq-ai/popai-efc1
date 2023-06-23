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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getOkrById, updateOkrById } from 'apiSdk/okrs';
import { Error } from 'components/error';
import { okrValidationSchema } from 'validationSchema/okrs';
import { OkrInterface } from 'interfaces/okr';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function OkrEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OkrInterface>(
    () => (id ? `/okrs/${id}` : null),
    () => getOkrById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OkrInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOkrById(id, values);
      mutate(updated);
      resetForm();
      router.push('/okrs');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OkrInterface>({
    initialValues: data,
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
            Edit Okr
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'okr',
  operation: AccessOperationEnum.UPDATE,
})(OkrEditPage);
