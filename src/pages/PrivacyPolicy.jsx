import React, { useState } from "react";
import { Button } from "antd";
import CMSContentEditor from "../components/Editor/Editor";

const PrivacyPolicyPage = () => {
 

  return (
    <div>
      <h2>Privacy Policy Editor</h2>
      <CMSContentEditor value={content} onChange={setContent} />
      <Button type="primary" onClick={handleSave} style={{ marginTop: 20 }}>
        Save Policy
      </Button>
    </div>
  );
};

export default PrivacyPolicyPage;
