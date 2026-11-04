import { useContext } from 'react'
import { general_sentences } from '../../../configurations/language'
import { Alert, Box, FormHelperText, InputLabel } from '@mui/material'
import { Controller } from 'react-hook-form'
import { MuiPhone } from '../../MuiPhone'
import { LanguageContext } from '../../../App'

function PhoneNumberInput({control, errors, failedMessage}) {
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language ?? "En";
  return (
    <Box>
          <InputLabel htmlFor="PhoneNumber">{general_sentences.PhoneNumber[language]}<span>*</span></InputLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <>
                <MuiPhone
                  defaultCountry="sd"
                  value={field.value ?? ""}
                  withCountries={false}
                  onChange={(value) => field.onChange(value ?? "")}
                />
                {errors.phoneNumber && (
                  <FormHelperText>
                    {errors.phoneNumber.message}
                  </FormHelperText>
                )}
              </>
            )}
          />
          {failedMessage && (
            <Alert variant="outlined" severity="error" sx={{mt: 3, backgroundColor: theme => theme.palette.error.light, borderColor: theme => theme.palette.error.main, color: theme => theme.palette.error.main}}>
              {failedMessage}
            </Alert>
          )}
        </Box>
  )
}

export default PhoneNumberInput