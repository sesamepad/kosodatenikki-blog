import { ProtectedRoute } from "@/auth/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import CreatePost from "@/pages/admin/CreatePost";
import Dashboard from "@/pages/admin/Dashboard";
import EditPost from "@/pages/admin/EditPost";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageDrafts from "@/pages/admin/ManageDrafts";
import ManagePosts from "@/pages/admin/ManagePosts";
import ManageTags from "@/pages/admin/ManageTags";
import { Route, Routes } from "react-router-dom";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="edit-drafts" element={<ManageDrafts />} />
        <Route path="edit-post/:id" element={<EditPost />} />
        <Route path="manage-posts" element={<ManagePosts />} />
        <Route path="manage-categories" element={<ManageCategories />} />
        <Route path="manage-tags" element={<ManageTags />} />
      </Route>
    </Routes>
  );
}
