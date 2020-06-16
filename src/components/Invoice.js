import React from "react";
import LogoImg from "../images/logo.jpg";
import Converter from "convert-rupees-into-words";
import Sign from "../images/sign.png";
import styled from "styled-components";

const StyledSheet = styled.div`
width: 100%;
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

function Invoice({invoiceData}) {
  return (
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
            <Title>{invoiceData.buyer_name}</Title>
            <Line1>{invoiceData.address_line_1}</Line1>
            <Line1>{invoiceData.address_line_2}</Line1>
          </Address>
          <InvoiceInfo>
            <Line1>Invoice No: {invoiceData.number}</Line1>
            <Line2>Invoice Date: {invoiceData.invoice_date.toDate().toDateString()}</Line2>
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
              <td>&#8377;{invoiceData.amount}</td>
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
              <td>&#8377;{invoiceData.final_amount}</td>
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
  )
}

export default Invoice;