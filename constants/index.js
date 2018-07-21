
const FONT_AWESOME_LINK = 'https://use.fontawesome.com/releases/v5.1.1/css/all.css'
const GAS_PRICE_URL = 'https://micm.gob.do/precios-de-combustibles'
const GAS_PRICE_STYLES = `
body { font-family: 'Helvetica', sans-serif; box-sizing: border-box; }
table { border-collapse: collapse; }
div.caption { display: flex; wrap-text: break-word; padding: 0 0 10px 0; }
div.header { height: 40px; display: flex; flex-direction: column; justify-content: center; }
span { color: #009dde; font-size: 13px; }
i.fa-gas-pump { align-self: center; align-self: flex-start; font-size: 45px; padding: 5px; color: #009dde; margin: 0 10px 0 0; }
i.fa-caret-up {  color: red; margin-left: 2px; }
i.fa-caret-down { color: green; margin-left: 2px; }
i.fa-equals { color: yellow; margin-left: 2px; }
tr > td:first-child { background-color: #aaaaaa; padding: 4px 6px; text-align: left; vertical-align: middle; border: 1px solid #fff; font-size: 15px; }
td  {
  background-color: #009dde;
  color: #fff;
  padding: 0 10px 0 10px;
  text-align: left;
  border: 1px solid #fff;
  font-size: 15px;
  font-weight: bold;
}
h3 { color: #009dde; text-transform: uppercase; line-height: 1.2rem; font-size: 20px; margin-bottom: 4px;}
div.container { width: 36%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
`

module.exports = {
  GAS_PRICE_STYLES,
  GAS_PRICE_URL,
  FONT_AWESOME_LINK
}
