import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';


function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const PriceInput = (props) => {
  return (
    <div style={{margin: 5}}>
      <TextField 
        {...props}
        InputProps={{
          inputComponent: NumberFormatCustom,
          endAdornment: <div>ریال</div>
        }}
      />
    </div>
  );
}

export default PriceInput;