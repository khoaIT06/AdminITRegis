import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Container,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import CategoryService from "~/admin/services/CategoryServices";

const CategoryComp = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAll(true, rowsPerPage, page + 1, debouncedSearch);
      setCategories(response.items);
      setTotalCount(response.totalCount);
      setFilteredCategories(response.items); // Lưu vào filteredCategories ban đầu
    } catch (error) {
      showAlert("Lỗi khi tải danh mục!", "error");
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ name: "" });
    setIsEditing(false);
    setEditingId(null);
    setError(false); // Reset lỗi khi đóng modal
    setHelperText(""); // Reset helperText khi đóng modal
  };

  const handleEdit = async (categoryId) => {
    try {
      const category = await CategoryService.getById(categoryId);
      setIsEditing(true);
      setEditingId(category.id);
      setFormData({ name: category.name || "" });
      handleModalOpen();
    } catch (error) {
      showAlert("Không thể tải dữ liệu danh mục!", "error");
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value.trim()) {
      setError(false);
      setHelperText("");
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      setError(true);
      setHelperText("Tên danh mục không được bỏ trống!");
      return;
    }

    try {
      if (isEditing) {
        await CategoryService.update({ id: editingId, name: formData.name });
        showAlert("Cập nhật danh mục thành công!", "success");
      } else {
        await CategoryService.create(formData);
        showAlert("Thêm danh mục thành công!", "success");
      }
      fetchCategories();
      handleModalClose();
    } catch (error) {
      showAlert("Lỗi khi lưu danh mục!", "error");
    }
  };

  const handleDeleteDialogOpen = (id) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleDelete = async () => {
    try {
      await CategoryService.delete(deletingId);
      showAlert("Xóa danh mục thành công!", "success");
      fetchCategories();
      handleDeleteDialogClose();
    } catch (error) {
      showAlert("Lỗi khi xóa danh mục!", "error");
    }
  };

  return (
    <Container>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={search}
          onChange={handleSearchChange} // Cập nhật tìm kiếm
          sx={{ width: "50%", marginRight: 2 }}
        />
        <Button variant="contained" color="success" startIcon={<Add />} onClick={handleModalOpen}>
          Thêm danh mục
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tên danh mục</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(category.id)}><Edit /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(category.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Dialog Thêm / Sửa */}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>{isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Tên danh mục"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => {
              setFormData({ name: e.target.value });
              if (e.target.value.trim()) {
                setError(false); // Reset lỗi khi có chữ
                setHelperText("");
              }
            }}
            error={error} // Hiển thị lỗi nếu có
            helperText={helperText} // Hiển thị thông báo lỗi
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">Hủy</Button>
          <Button variant="contained" onClick={handleFormSubmit} color="primary">{isEditing ? "Cập nhật" : "Thêm"}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent dividers>
          <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">Hủy</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryComp;