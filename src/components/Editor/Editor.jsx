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
          <div className="max-w-4xl mx-auto space-y-10 text-gray-300">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We may collect user names, email addresses, contact numbers, and
            browsing behavior. This data is stored securely in our Firestore
            database.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            2. How We Use Data
          </h2>
          <p>
            Your data is used solely for enhancing user experience, customizing
            product views, and managing orders or enquiries. We never sell or
            share your data with third parties.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            3. Data Control & Security
          </h2>
          <p>
            All dynamic content including categories, subcategories, product
            details, and user data is stored and served via Firestore with
            security rules applied to prevent unauthorized access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            4. User Rights
          </h2>
          <p>
            You can contact us anytime to view, edit, or delete your personal
            data from our system.
          </p>
        </motion.div>
      </div>
  `,
  "terms-conditions": `
      <div className="max-w-4xl mx-auto space-y-10 text-gray-300">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Kothari Gems website, you agree to be
            bound by these Terms & Conditions and all applicable laws.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            2. Use of Data
          </h2>
          <p>
            All content on this platform including product information,
            categories, and policies is dynamic and fetched from our backend
            database (Firestore). Unauthorized access or scraping is prohibited.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            3. Orders & Payments
          </h2>
          <p>
            Prices are dynamic and subject to change without notice. Orders made
            via WhatsApp or form will be confirmed separately before processing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-300 text-xl font-semibold mb-2">
            4. Intellectual Property
          </h2>
          <p>
            All trademarks, content, and images are the property of Kothari Gems
            and cannot be reused without explicit permission.
          </p>
        </motion.div>
      </div>
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
