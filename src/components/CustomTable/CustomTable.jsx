import React from "react";
import { Table } from "antd";
import "./CustomTable.css"; // custom styles here

const CustomTable = ({ dataSource, columns, pagination, onChange }) => {
  return (
    <div className="custom-table-wrapper">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={onChange}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        className="custom-ant-table"
        size="middle"
        scroll={{ x: true }}
        bordered
        rowKey={(record) => record.id || record._id || record.key}
      />
    </div>
  );
};

export default CustomTable;
