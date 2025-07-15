import React, { useState } from "react";
import { Tabs } from "antd";
import { FaBox } from "react-icons/fa";
import SingleProductForm from "../../components/ProductFrom/SingleProductForm";
import BulkProductForm from "../../components/ProductFrom/BulkProductForm";

const { TabPane } = Tabs;

const CreateProduct = () => {
  const [bulkProducts, setBulkProducts] = useState([]);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "10px 24px",
        border: "1px solid grey",
        borderRadius: "4px",
      }}
    >
      <h4>
        <FaBox style={{ marginRight: 8 }} size={14}/>
        Add Product
      </h4>

      <Tabs defaultActiveKey="single">
        <TabPane tab="Single Product Upload" key="single">
          <SingleProductForm />
        </TabPane>
        {/* <TabPane tab="Bulk Product Upload" key="bulk">
          <BulkProductForm
            bulkProducts={bulkProducts}
            setBulkProducts={setBulkProducts}
          />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default CreateProduct;
