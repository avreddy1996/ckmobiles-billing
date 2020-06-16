import React, {useEffect, useState} from "react";
import styled from "styled-components";
import LogoImg from "../images/logo.jpg";
import Sign from "../images/sign.png";
import {Input} from "antd";
import firebase from "firebase";
import db from '../firebase';
import {DatePicker, Button, message} from "antd";
import moment from "moment";
import Converter from "convert-rupees-into-words"

const StyledSheet = styled.div`
width: 100%;
max-width: 720px;
margin: 20px auto;
background: #fff;
padding: 32px;
@media screen {
box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
}
`;
const RowItem = styled.div`
display: flex;
flex-direction: ${props => props.column? 'column':'row'};
& p{
margin: 0;
font-size: 10px;
}
`;
const Address = styled.div`
flex: 1 1 ;
flex-basis: ${props => props.lite? '':'70%'};
`;
const Title = styled.div`
font-size: 18px;
color: #000;
`;
const Line1 = styled.div`

`;
const Line2 = styled.div`

`;
const Line3 = styled.div`

`;
const Logo = styled.div`
flex: 1 1 10%;
& img {
width: 100%;
}
`;
const InvoiceInfo = styled.div`
margin-left: 16px;
& div{
white-space: nowrap;
}
`;
const HeaderText = styled.div`
font-size: 40px;
font-weight: 600;
flex: 1;
text-align: center;
padding: 16px;
`;
const Table = styled.table`
margin: 16px 0 4px 0;
width: 100%;
border-collapse: collapse;
& th{
padding: 8px 16px;
border: 1px solid #f6f6f6;
}
& td{
padding: 8px 16px;
border: 1px solid #f6f6f6;
& input{
max-width: 150px;
border: none;
border-bottom: 1px solid;
text-align: right;
padding: 0;
}
&:last-child{
text-align: right
}
`;
const BuyerSign = styled.div`
flex: 1 1 50%;
`;
const SellerSign = styled.div`
flex: 1 1 50%;
text-align: center;
`;
const SignArea = styled.div`
width: 100%;
height: 60px;
`;
const SignImage = styled.img`
height: 60px;
`;
const ButtonRowItem = styled.div`
margin: 16px 0;
display: flex;
align-items: center;
justify-content: center;
& button{
margin: 0 10px;
}
`;
const billAddresses = [
  {
    party_name: 'Saketh',
    address_line1: 'Kamalapuram',
    address_line2: 'Kadapa - 516289'
  }
];
function NewInvoice() {
  const [billTo, setBillTo] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    buyer_name: '',
    created_at: moment(new Date()),
    cgst: 9,
    sgst: 9,
    final_amount: 0,
    item: 'JIO ETOP',
    amount: 0,
    invoice_date: moment(new Date()),
    number: 1,
    gst: '',
    address_line_1: '',
    address_line_2: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    db.collection('invoices').orderBy("created_at","desc").limit(1).get()
        .then((snapshot)=>{
          const data = snapshot.docs.map(doc => doc.data());
          console.log(data);
          setInvoices(data);
        })
        .catch(error=>{
          console.log(error)
        })
  },[]);
  useEffect(()=>{
    if(invoices[invoices.length - 1]){
      setInvoiceData({
        ...invoiceData,
        number: invoices[invoices.length - 1].number + 1
      })
    }
  },[invoices]);
  const handleKeyChange = (key, value) => {
    if(key === 'amount' && Number(value)){
      setInvoiceData({
        ...invoiceData,
        [key] : Number(value),
          final_amount: parseFloat((Number(value) + Number(value*invoiceData.sgst/100) + Number(value*invoiceData.cgst/100)).toFixed(2))
      })
    }else if(key === 'final_amount' && Number(value)){
      debugger;
      setInvoiceData({
        ...invoiceData,
        [key]: Number(value),
        amount: parseFloat((Number(value)/(1 + Number(invoiceData.sgst/100) + Number(invoiceData.cgst/100))).toFixed(2))
      })
    }else{
      setInvoiceData({
        ...invoiceData,
        [key]: value
      });
    }
  };
  const handleSave = () => {
    setSaving(true);
    message.loading('Saving Invoice...');
    db.collection('invoices').add({
      ...invoiceData,
      created_at: firebase.firestore.Timestamp.fromDate(new Date()),
      invoice_date: firebase.firestore.Timestamp.fromDate(new Date(invoiceData.invoice_date))
    })
        .then(doc => {
          console.log(doc);
          setSaving(false);
          message.success('Invoice Save...')
        })
        .catch(err => {
          message.error('Invoice Failed');
          console.log(err);
          setSaving(false);
        })
  };

  return (
      <>
      <StyledSheet id={'printarea'}>
        <RowItem>
          <Address>
            <Title>Chaitanya Communications</Title>
            <Line1>#15/408-2, Near SBI ATM, Cross Road, Yerraguntla Bypass</Line1>
            <Line2>Kamalapuram - 516289, Kadapa Dist., Andhra Pradesh</Line2>
            <Line3>GSTIN : 37APBPH9946L1ZB</Line3>
          </Address>
          <Logo>
            <img src={LogoImg} alt={'logo'}/>
          </Logo>
        </RowItem>
        <RowItem>
          <HeaderText>
            TAX INVOICE
          </HeaderText>
        </RowItem>
        <RowItem style={{alignItems: 'center'}}>
          <Address lite>
            <Line1>Bill to :</Line1>
            <Title><Input name={'party_name'} autoComplete={'party_name'} placeholder={'Enter Name here'} value={invoiceData.buyer_name} onChange={(e)=>handleKeyChange('buyer_name',e.target.value)} /></Title>
            <Line1><Input name={'address_line1'} autoComplete={'address_line1'} placeholder={'Enter Address'} value={invoiceData.address_line_1} onChange={(e)=>handleKeyChange('address_line_1',e.target.value)} /></Line1>
          </Address>
          <InvoiceInfo>
            <Line1>Invoice No: {invoiceData.number}</Line1>
            <Line2>Invoice Date: <DatePicker onChange={(date)=>handleKeyChange('invoice_date', date)} defaultvalue={invoiceData.invoice_date} /></Line2>
          </InvoiceInfo>
        </RowItem>
        <RowItem>
          <Table>
            <thead>
            <tr>
              <th>#</th>
              <th>ITEM NAME</th>
              <th>QTY</th>
              <th>RATE</th>
              <th>GST</th>
              <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>1</td>
              <td>{invoiceData.item}</td>
              <td>1</td>
              <td>{invoiceData.amount}</td>
              <td>{(invoiceData.amount*0.18).toFixed(2)} (18%)</td>
              <td><Input value={invoiceData.amount} name={"invoice_amount"} onChange={(e)=>handleKeyChange('amount',e.target.value)} /></td>
            </tr>
            <tr>
              <td>
                &nbsp;
              </td>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
              <td>

              </td>
            </tr>
            <tr>
              <td rowSpan={3} colSpan={3}>
                {invoiceData.final_amount > 0 && Converter(invoiceData.final_amount)}
              </td>
              <td colSpan={2}>CGST {invoiceData.cgst}%</td>
              <td>{(invoiceData.amount*invoiceData.cgst/100).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>SGST {invoiceData.sgst}%</td>
              <td>{(invoiceData.amount*invoiceData.sgst/100).toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Total</td>
              <td><Input value={invoiceData.final_amount} name={"final_amount"} onChange={(e)=>handleKeyChange('final_amount',e.target.value)} /></td>
            </tr>
            </tbody>
          </Table>
        </RowItem>
        <RowItem column>
          <p>*Payment should be made by only Cash/Debit</p>
          <p>*Goods once sold cannot be taken back</p>
          <p>*Complaints and clarifications will not be entertained after delivery</p>
          <p>*Subject to Kamalapuram Jurisdiction only. I & O.E.</p>
        </RowItem>
        <RowItem style={{alignItems: 'flex-end', paddingTop: '16px'}}>
          <BuyerSign>
            <SignArea />
            Receiver's Signature
          </BuyerSign>
          <SellerSign>
            For CHAITANYA COMMUNICATIONS
            <SignImage src={Sign} alt={'sign'} />
            Authorise Signatory
          </SellerSign>
        </RowItem>
      </StyledSheet>
        <ButtonRowItem>
        <Button type={'primary'} loading={saving} onClick={handleSave}>Save</Button>
          <Button danger>Reset</Button>
        </ButtonRowItem>
        </>
  )
}

export default NewInvoice;