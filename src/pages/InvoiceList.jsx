import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import { bulkInvoiceEdit } from "../redux/invoicesSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const [bulkEdit, setBulkEdit] = useState(true);
  const [billTo, setBillTo] = useState("");
  const [total, setTotal] = useState("");
  const [dateOfIssue, setdateOfIssue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  function handleBulkEdit() {
    const updatedInvoices = invoiceList.map((invoice) => ({
      ...invoice,
      billTo: billTo[invoice.id] || invoice.billTo,
      dateOfIssue: dateOfIssue[invoice.id] || invoice.dateOfIssue,
      total: total[invoice.id] || invoice.total,
    }));

    dispatch(bulkInvoiceEdit(updatedInvoices));
    setBulkEdit((bulkEdit) => !bulkEdit);
  }

  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                  <Button variant="dark mb-2 mb-md-4" onClick={handleBulkEdit}>
                    {bulkEdit
                      ? "Click Here To Edit The Invoices In Bulk"
                      : "Clicked Here To Update The Invoice"}
                  </Button>
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                      onHandleBulkEdit={bulkEdit}
                      billTo={billTo}
                      setBillTo={setBillTo}
                      dateOfIssue={dateOfIssue}
                      setdateOfIssue={setdateOfIssue}
                      total={total}
                      setTotal={setTotal}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({
  invoice,
  navigate,
  onHandleBulkEdit,
  billTo,
  setBillTo,
  dateOfIssue,
  setdateOfIssue,
  total,
  setTotal,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  // console.log(billTo[invoice.id].length);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <>
        <td>{invoice.invoiceNumber}</td>
        <td className="fw-normal">
          {onHandleBulkEdit ? (
            invoice.billTo
          ) : (
            <input
              value={
                billTo[invoice.id] !== undefined
                  ? billTo[invoice.id]
                  : invoice.billTo
              }
              type="text"
              onChange={(e) =>
                setBillTo({
                  [invoice.id]: e.target.value,
                })
              }
            ></input>
          )}
        </td>
        <td className="fw-normal">
          {onHandleBulkEdit ? (
            invoice.dateOfIssue
          ) : (
            <input
              value={
                dateOfIssue[invoice.id] !== undefined
                  ? dateOfIssue[invoice.id]
                  : invoice.dateOfIssue
              }
              type="text"
              onChange={(e) =>
                setdateOfIssue({
                  ...dateOfIssue,
                  [invoice.id]: e.target.value,
                })
              }
            ></input>
          )}
        </td>
        <td className="fw-normal">
          {invoice.currency}
          {onHandleBulkEdit ? (
            invoice.total
          ) : (
            <input
              value={
                total[invoice.id] !== undefined
                  ? total[invoice.id]
                  : invoice.total
              }
              type="number"
              onChange={(e) =>
                setTotal({ ...total, [invoice.id]: e.target.value })
              }
            ></input>
          )}
        </td>
      </>

      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
