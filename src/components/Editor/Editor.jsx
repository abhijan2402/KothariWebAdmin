import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Spin, Tabs } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const { TabPane } = Tabs;

const DEFAULT_CONTENT = {
  "privacy-policy": `
    <h2>Privacy Policy</h2>
    <p>This is our privacy policy. Please update accordingly.</p>
  `,
  "terms-conditions": `
    <h2>Terms & Conditions</h2>
    <p>These are our terms and conditions. Please update accordingly.</p>
  `,
};

const CMSPrivacyEditor = () => {
  const [activeTab, setActiveTab] = useState("privacy-policy");
  const [isFetching, setIsFetching] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const fetchCMSData = async () => {
    if (!editor) return;

    setIsFetching(true);
    try {
      const docRef = doc(db, "cms", activeTab);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentDocId(docSnap.id);
        editor.commands.setContent(docSnap.data().description);
      } else {
        setCurrentDocId(null);
        editor.commands.setContent(DEFAULT_CONTENT[activeTab]);
      }
    } catch (error) {
      toast.error("Failed to fetch CMS content");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, [activeTab, editor]);

  const handleSave = async () => {
    if (!editor) return;
    const htmlContent = editor.getHTML();

    try {
      const payload = {
        slug: activeTab,
        description: htmlContent,
        status: 1,
      };

      await setDoc(doc(db, "cms", activeTab), payload);
      toast.success(`"${activeTab.replace("-", " ")}" saved successfully`);
    } catch (error) {
      toast.error("Failed to save CMS content.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">CMS Editor</h2>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        className="mb-4"
      >
        <TabPane tab="Privacy Policy" key="privacy-policy" />
        <TabPane tab="Terms & Conditions" key="terms-conditions" />
      </Tabs>

      <div className="border rounded shadow-md bg-white min-h-[300px]">
        {isFetching ? (
          <div className="p-6 text-center">
            <Spin size="large" />
          </div>
        ) : (
          <EditorContent
            editor={editor}
            className="p-6 min-h-[300px] prose prose-sm sm:prose lg:prose-lg"
          />
        )}
      </div>

      <Button
        type="primary"
        onClick={handleSave}
        size="large"
        className="mt-6"
        style={{ width: "14%" }}
        disabled={isFetching || !editor}
      >
        Save
      </Button>
    </div>
  );
};

export default CMSPrivacyEditor;
