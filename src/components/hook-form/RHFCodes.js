import { Stack, TextField } from "@mui/material";
import React from "react";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

const RHFCodes = ({ keyName = "", inputs = [], ...other }) => {
  const codesRef = useRef(null);

  const { control } = useFormContext();

  const handleChageWithNextField = (event, handleChange) => {
    const { maxLength, value, name } = event.target;

    const fieldIndex = name.replace(keyName, "");

    const fieldInIndex = Number(fieldIndex);

    const nextField = document.querySelector(
      `input[name=${keyName}${fieldInIndex + 1}]`
    );

    if (value.length > maxLength) {
      event.target.value = value[0];
    }

    if (value.length >= maxLength && fieldInIndex < 6 && nextField !== null) {
      nextField.focus();
    }

    handleChange(event);
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}
      justifyContent={"center"}
      ref={codesRef}
    >
      {inputs.map((name, index) => (
        <Controller
          key={name}
          name={`${keyName}${index + 1}`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              autoFocus={index === 0}
              placeholder={"-"}
              onChange={(event) => {
                handleChageWithNextField(event, field.onChange);
              }}
              onFocus={(event) => event.currentTarget.select()}
              InputProps={{
                sx: {
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 },
                  "& input": { p: 0, textAlign: "center" },
                },
              }}
              inputProps={{
                maxLength: 1,
                type: "number",
              }}
              {...other}
            />
          )}
        ></Controller>
      ))}
    </Stack>
  );
};

export default RHFCodes;