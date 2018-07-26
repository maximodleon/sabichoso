
const GAS_PRICE_URL = 'https://micm.gob.do/precios-de-combustibles'
const GAS_PRICE_STYLES = `
body { font-family: 'Helvetica', sans-serif; box-sizing: border-box; }
table { border-collapse: collapse; }
div.caption { display: flex; wrap-text: break-word; padding: 0 0 10px 0; }
div.header { height: 40px; display: flex; flex-direction: column; justify-content: center; }
span { color: #ff4c4c; font-size: 13px; }
span.gas-pump { align-self: center; align-self: flex-start; font-size: 45px; padding: 5px; margin: 0 10px 0 0; }
tr > td:first-child { background-color: #aaaaaa; padding: 4px 6px; text-align: left; vertical-align: middle; border: 1px solid #fff; font-size: 15px; }
td  {
  background-color: #ff4c4c;
  color: #fff;
  padding: 0 10px 0 10px;
  text-align: left;
  border: 1px solid #fff;
  font-size: 15px;
  font-weight: bold;
}
h3 { color: #ff4c4c; text-transform: uppercase; line-height: 1.2rem; font-size: 20px; margin-bottom: 4px;}
div.container { width: 36%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
`
const PUMP_ICON = '⛽'

module.exports = {
  GAS_PRICE_STYLES,
  GAS_PRICE_URL,
  PUMP_ICON
}
