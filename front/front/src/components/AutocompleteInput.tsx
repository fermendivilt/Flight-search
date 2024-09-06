import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import React, { useEffect } from "react";
import { ListElement } from "../dto/SelectListDTO";

type Option = ListElement;

type OptionList = {
  options: Array<Option>;
  getOptionLabel: (option: Option) => string;
};

interface AutocompleteInputProps {
  label: string;
  id: string;
  options: OptionList;
  loading: boolean;
  handleType: (value: string) => void;
  handleSelect: (value: Option | null) => void;
  validationError: string;
}

export default function AutocompleteInput({
  label,
  id,
  options,
  loading,
  handleType,
  handleSelect,
  validationError,
}: AutocompleteInputProps) {
  return (
    <>
      <Grid2 size={5}>
        <Typography variant="h5" align="right">
          <label htmlFor={id}>{label}</label>
        </Typography>
      </Grid2>

      <Grid2 size={6}>
        <Autocomplete
          {...options}
          filterOptions={(x) => x}
          noOptionsText="No locations"
          id={id}
          selectOnFocus
          blurOnSelect
          clearOnBlur
          handleHomeEndKeys
          loading={loading}
          onInputChange={(_e, value, _r) => {
            if (
              value.length > 0 &&
              !options.options.find((x) => x.displayName === value)
            )
              handleType(value);
          }}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.displayName}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                },
              }}
            />
          )}
          onChange={(_e, value, _r, _d) => handleSelect(value)}
        />
        <Typography variant="caption" className="error">
          {validationError}
        </Typography>
      </Grid2>
    </>
  );
}

export type { Option, OptionList };
