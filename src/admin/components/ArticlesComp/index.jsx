import React, { useState, useEffect, useCallback } from "react";
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Edit, Delete, Add, PhotoCamera, InsertDriveFile } from "@mui/icons-material";

import ArticleService from "~/admin/services/ArticleServices"; 
import CategoryService from "~/admin/services/CategoryServices";

const ArticleComp = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Image: "",
    FilePath: "",
    CategoryID: "",
    AccountID: 3
  });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await ArticleService.getAll(true, rowsPerPage, page + 1, debouncedSearch);
      setArticles(response.items);
      setTotalCount(response.totalCount);
      setFilteredArticles(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải bài viết!", "error");
    }
  }, [debouncedSearch, page, rowsPerPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await CategoryService.getAll(false);
      setCategories(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải danh mục!", "error");
    }
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Chưa có danh mục";
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
    setFormData({
      Name: "",
      Image: "",
      FilePath: "",
      CategoryID: "",
      AccountID: 3
    });
    setIsEditing(false);
    setEditingId(null);
    setError(false);
    setHelperText("");
  };

  const handleEdit = async (articleId) => {
    try {
      const article = await ArticleService.getById(articleId);
      setIsEditing(true);
      setEditingId(article.id);
      setFormData({
        Name: article.name || "",
        Image: article.image || "",
        FilePath: article.filePath || "",
        CategoryID: article.categoryID || "",
        AccountID: 3
      });
      handleModalOpen();
    } catch (error) {
      showAlert("Không thể tải dữ liệu bài viết!", "error");
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value.trim()) {
      setError(false);
      setHelperText("");
    }
  };

  const [helperText, setHelperText] = useState({
    Name: "",
    CategoryID: "",
    Image: "",
    FilePath: ""
  });

  const handleFormSubmit = async () => {
    setHelperText({
        Name: "",
        CategoryID: "",
        Image: "",
        FilePath: ""
    });

    let hasError = false;

    if (!formData.Name.trim()) {
        setHelperText((prev) => ({ ...prev, Name: "Tên bài viết không được bỏ trống!" }));
        hasError = true;
    }

    if (!formData.CategoryID) {
    setHelperText((prev) => ({ ...prev, CategoryID: "Danh mục không được bỏ trống!" }));
    hasError = true;
    }

    if (!formData.Image) {
    setHelperText((prev) => ({ ...prev, Image: "Vui lòng chọn ảnh cho bài viết!" }));
    hasError = true;
    }

    if (!formData.FilePath) {
    setHelperText((prev) => ({ ...prev, FilePath: "Vui lòng chọn file PDF cho bài viết!" }));
    hasError = true;
    }

    if (hasError) return;

    try {
      let uploadedImageUrl = formData.Image;
      let uploadedFileUrl = formData.FilePath;

      if (formData.Image && formData.Image instanceof File) {
        const uploadedImage = await ArticleService.uploadImage(formData.Image);
        if (uploadedImage) {
          uploadedImageUrl = uploadedImage;
        } else {
          throw new Error("Lỗi khi tải lên ảnh");
        }
      }

      if (formData.FilePath && formData.FilePath instanceof File) {
        const uploadedFile = await ArticleService.uploadFile(formData.FilePath);
        if (uploadedFile) {
          uploadedFileUrl = uploadedFile;
        } else {
          throw new Error("Lỗi khi tải lên file");
        }
      }

      const newArticle = {
        ...formData,
        Image: uploadedImageUrl,
        FilePath: uploadedFileUrl
      };

      if (isEditing) {
        await ArticleService.update({ id: editingId, ...newArticle });
        showAlert("Cập nhật bài viết thành công!", "success");
      } else {
        await ArticleService.create(newArticle);
        showAlert("Thêm bài viết thành công!", "success");
      }

      fetchArticles();
      handleModalClose();
    } catch (error) {
        showAlert(error.message || "Lỗi khi lưu bài viết!", "error");
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
      await ArticleService.delete(deletingId);
      showAlert("Xóa bài viết thành công!", "success");
      fetchArticles();
      handleDeleteDialogClose();
    } catch (error) {
      showAlert("Lỗi khi xóa bài viết!", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Image: file });
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, FilePath: file });
    }
  };

  const handleViewPdf = (file) => {
    let fileUrl = "";
    if(file instanceof File){
        fileUrl = URL.createObjectURL(file);
    }
    else{
        fileUrl = process.env.REACT_APP_API_BASE_URL + file;
    }
    window.open(fileUrl, "_blank");
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
          onChange={handleSearchChange}
          sx={{ width: "50%", marginRight: 2 }}
        />
        <Button variant="contained" color="success" startIcon={<Add />} onClick={handleModalOpen}>
          Thêm bài viết
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tên bài viết</strong></TableCell>
              <TableCell><strong>Danh mục</strong></TableCell>
              <TableCell><strong>Ảnh</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.name}</TableCell>
                <TableCell>{getCategoryName(article.categoryID) || "Chưa có danh mục"}</TableCell>
                <TableCell>{
                    <Box sx={{ my: 1 }}>
                    <img
                      src={process.env.REACT_APP_API_BASE_URL + article.image}
                      alt="Không tìm thấy"
                      style={{ maxWidth: "100%", maxHeight: "50px" }}
                    />
                  </Box>
                }</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(article.id)}><Edit /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(article.id)}><Delete /></IconButton>
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

      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>{isEditing ? "Chỉnh sửa bài viết" : "Thêm bài viết"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên bài viết"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.Name}
                onChange={(e) => {
                  setFormData({ ...formData, Name: e.target.value });
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, Name: "" });
                  }
                }}
              />
              {helperText.Name && <Box color="red">{helperText.Name}</Box>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Thể loại</InputLabel>
                <Select
                  labelId="category-label"
                  value={formData.CategoryID}
                  label="Thể loại"
                  onChange={(e) => {setFormData({ ...formData, CategoryID: e.target.value })
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, CategoryID: "" });
                    }
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {helperText.CategoryID && <Box color="red">{helperText.CategoryID}</Box>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                fullWidth
              >
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.Image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.Image instanceof File ? URL.createObjectURL(formData.Image) : process.env.REACT_APP_API_BASE_URL + formData.Image}
                    alt="Selected"
                    style={{ maxWidth: "100%", maxHeight: "150px" }}
                  />
                </Box>
              )}
              {helperText.Image && <Box color="red">{helperText.Image}</Box>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                startIcon={<InsertDriveFile />}
                fullWidth
              >
                Chọn file
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={handlePdfChange}
                />
              </Button>
              {formData.FilePath && (
                <Box sx={{ mt: 2 }}>
                <p>{formData.FilePath.name}</p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewPdf(formData.FilePath)}
                    startIcon={<InsertDriveFile />}
                >
                    Xem file PDF
                </Button>
                </Box>
            )}
            {helperText.FilePath && <Box color="red">{helperText.FilePath}</Box>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">Hủy</Button>
          <Button variant="contained" onClick={handleFormSubmit} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent dividers>
          Bạn có chắc chắn muốn xóa bài viết này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">Hủy</Button>
          <Button variant="contained" onClick={handleDelete} color="secondary">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArticleComp;