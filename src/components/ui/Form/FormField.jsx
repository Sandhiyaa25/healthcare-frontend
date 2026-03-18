import React from 'react';
import { FieldWrap, Label, InputEl, ErrorMsg, HelperText, InputWrapper, IconSlot } from './FormField.styled';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helper,
  placeholder,
  required,
  disabled,
  prefix,
  suffix,
  ...rest
}) => (
  <FieldWrap>
    {label && (
      <Label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Label>
    )}
    <InputWrapper $hasError={!!error} $disabled={disabled}>
      {prefix && <IconSlot $side="left">{prefix}</IconSlot>}
      <InputEl
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        $hasPrefix={!!prefix}
        $hasSuffix={!!suffix}
        $hasError={!!error}
        {...rest}
      />
      {suffix && <IconSlot $side="right">{suffix}</IconSlot>}
    </InputWrapper>
    {error  && <ErrorMsg role="alert">{error}</ErrorMsg>}
    {helper && !error && <HelperText>{helper}</HelperText>}
  </FieldWrap>
);

export default FormField;
