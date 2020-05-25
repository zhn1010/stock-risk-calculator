import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider, TextField, Button } from '@material-ui/core';
// import Pdf from "react-to-pdf";
import { exportComponentAsPDF } from "react-component-export-image";
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PriceInput from './PriceInput';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function RTL(props) {
  return (
    <StylesProvider jss={jss}>
      {props.children}
    </StylesProvider>
  );
}

function numberWithCommas(x, num = 3) {
  const regex = new RegExp(`\\B(?=(\\d{${num}})+(?!\\d))`, 'g');
  return x.toString().replace(regex, ",");
}

function App() {
  const [values, setValues] = React.useState({
    investmentAmount: '',
    riskPercent: null,
    riskPrice: '',
    profitLimit: '',
    buyPrice: '',
    lossLimit: '',
    indexName: '',
  });
  const componentRef = React.useRef();
  const theme = createMuiTheme({
    direction: 'rtl',
    typography: {
      fontFamily: [
        'Almarai',
      ].join(','),
    },
  });
  
  const handleChange = (event) => {
    let aug = {};
    if (event.target.name === "riskPercent") {
      aug = {riskPrice: values.investmentAmount * event.target.value / 100};
    } 
    else if (event.target.name === "riskPrice") {
      aug = {riskPercent: Math.floor((event.target.value / values.investmentAmount) * 100)};
    }
    setValues({
      ...values,
      [event.target.name]: event.target.value,
      ...aug,
    });
  };

  const now = new Date();

  const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const dateString = now.toLocaleDateString("fa", dateOptions);
  const timeString = now.toLocaleTimeString("fa", timeOptions);

  const dateTime = `${dateString} - ${timeString}`;

  const tradeValume = values.riskPrice/(values.buyPrice - values.lossLimit) || 0;
  const tradeProfit = tradeValume * (values.profitLimit - values.buyPrice);
  const tradeRisk = values.riskPrice;
  const profitToLossRatio = parseFloat(((values.profitLimit - values.buyPrice) / (values.buyPrice - values.lossLimit)) || 0).toFixed(2);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md>
              <div className="box">
                <RTL>
                    <div style={{margin: 5}}>
                      <TextField
                        value={values.indexName}
                        onChange={handleChange}
                        style={{width: 230}}
                        label="نام نماد"
                        name="indexName"
                      />
                    </div>
                    <PriceInput 
                      value={values.investmentAmount}
                      onChange={handleChange}
                      label="سرمایه بورسی شما"
                      name="investmentAmount"
                    />
                    <div style={{margin: 5}}>
                      <TextField
                        value={values.riskPercent}
                        onChange={handleChange}
                        label="درصد ریسک مجاز"
                        name="riskPercent"
                        type="number"
                        style={{width: 230}}
                        error={values.riskPercent > 100 || values.riskPercent < 0}
                        InputProps={{
                          inputProps: { min: 0, max: 100 },
                          endAdornment: <div>%</div>
                        }}
                      />
                    </div>
                    <PriceInput
                      value={values.riskPrice}
                      onChange={handleChange}
                      error={Number(values.riskPrice) > Number(values.investmentAmount)}
                      label="مبلغ ریسک مجاز"
                      name="riskPrice"
                    />
                    <PriceInput
                      value={values.profitLimit}
                      onChange={handleChange}
                      label="حد سود"
                      name="profitLimit"
                    />
                    <PriceInput
                      value={values.buyPrice}
                      onChange={handleChange}
                      label="قیمت خرید"
                      name="buyPrice"
                    />
                    <PriceInput
                      value={values.lossLimit}
                      onChange={handleChange}
                      label="حد ضرر"
                      name="lossLimit"
                    />
                </RTL>
              </div>
            </Grid>
            <Grid item md>
              <div className="box">
                <Table ref={componentRef} style={{marginBottom: 15}}>
                  <TableBody>
                      <TableRow>
                        <TableCell align="right">تاریخ و زمان</TableCell>
                        <TableCell align="right" className="bold">{dateTime}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">نام نماد</TableCell>
                        <TableCell align="right" className="bold">{values.indexName}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">حجم معامله</TableCell>
                        <TableCell align="right" className="bold">{tradeValume}</TableCell>
                        <TableCell align="right">تعداد سهم</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">‎ریسک معامله</TableCell>
                        <TableCell align="right" className="bold">{numberWithCommas(tradeRisk)}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">سرمایه مورد نیاز</TableCell>
                        <TableCell align="right" className="bold">{tradeValume * values.buyPrice}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">سود سرمایه‌گذاری</TableCell>
                        <TableCell align="right" className="bold">{tradeProfit}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">حد سود</TableCell>
                        <TableCell align="right" className="bold">{numberWithCommas(values.profitLimit)}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">قیمت خرید</TableCell>
                        <TableCell align="right" className="bold">{numberWithCommas(values.buyPrice)}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">حد ضرر</TableCell>
                        <TableCell align="right" className="bold">{numberWithCommas(values.lossLimit)}</TableCell>
                        <TableCell align="right">ریال</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">نسبت سود به ضرر</TableCell>
                        <TableCell align="right" className="bold">{profitToLossRatio}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
                <Button variant="contained" color="primary" onClick={() => exportComponentAsPDF(componentRef, `${values.indexName} ${dateTime}.pdf`)}>
                  دانلود فایل PDF
                </Button>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
