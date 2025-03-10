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
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import { Add, Edit, Restore, Lock, LockOpen } from "@mui/icons-material";

import AccountService from "~/admin/services/AccountServices";
import RoleService from "~/admin/services/RoleServices";

const AccountComp = () => {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Username: "",
    Name: "",
    Birthday: "",
    Phone: "",
    Email: "",
    Password: "",
    RoleId: ""
  });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isDisableAccountDialogOpen, setIsDisableAccountDialogOpen] = useState(false);
  const [accountToReset, setAccountToReset] = useState(null);
  const [accountToDisable, setAccountToDisable] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchAccounts();
    fetchRoles();
  }, [debouncedSearch, page, rowsPerPage]);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await AccountService.getAll(true, rowsPerPage, page + 1, search);
      setAccounts(response.items);
      setTotalCount(response.totalCount);
      setFilteredAccounts(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải tài khoản!", "error");
    }
  }, [debouncedSearch, page, rowsPerPage]);

  const fetchRoles = async () => {
    try {
      const rolesData = await RoleService.getAll(false);
      if (Array.isArray(rolesData.items)) {
        setRoles(rolesData.items);
      } else {
        console.error("Dữ liệu vai trò không phải là mảng", rolesData.items);
        showAlert("Dữ liệu vai trò không hợp lệ!", "error");
      }
    } catch (error) {
      console.error("Không thể tải vai trò!", error);
      showAlert("Không thể tải vai trò!", "error");
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
    setFormData({
      Username: "",
      Name: "",
      Birthday: "",
      Phone: "",
      Email: "",
      Password: "",
      RoleId: ""
    });
    setIsEditing(false);
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = async (accountId) => {
    try {
      const account = await AccountService.getById(accountId);
      setIsEditing(true);
      setEditingId(account.id);
      setFormData({
        Username: account.username || "",
        Name: account.name || "",
        Birthday: account.birthday ? new Date(account.birthday).toISOString().split('T')[0] : "",
        Phone: account.phone || "",
        Email: account.email || "",
        Password: "",
        RoleId: account.roleID || ""
      });
      handleModalOpen();
    } catch (error) {
      showAlert("Không thể tải dữ liệu tài khoản!", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: ""
    }));
  };

  const validateForm = async () => {
    const newErrors = {};

    const response = await AccountService.getAll(false);
    const allAccounts = response.items;

    const existingAccount = allAccounts.find(account => account.username === formData.Username);
    if (existingAccount && existingAccount.id !== editingId) {
        newErrors.Username = "Tên tài khoản đã tồn tại!";
    }

    const existingEmail = allAccounts.find(account => account.email === formData.Email);
    if (existingEmail && existingEmail.id !== editingId) {
        newErrors.Email = "Email đã tồn tại!";
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.Email)) {
        newErrors.Email = "Email không hợp lệ!";
    }
  
    if (!/^\d{10,12}$/.test(formData.Phone)) {
      newErrors.Phone = "Số điện thoại phải có từ 10 đến 12 chữ số!";
    }
  
    const today = new Date();
    const birthDate = new Date(formData.Birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && month < 0)) {
      newErrors.Birthday = "Bạn phải đủ 18 tuổi!";
    }
  
    if (!formData.Username) newErrors.Username = "Tên tài khoản không được để trống!";
    if (!formData.Name) newErrors.Name = "Tên không được để trống!";
    if (!formData.Birthday) newErrors.Birthday = "Ngày sinh không được để trống!";
    if (!formData.Phone) newErrors.Phone = "Số điện thoại không được để trống!";
    if (!formData.Email) newErrors.Email = "Email không được để trống!";
    if (!formData.RoleId) newErrors.RoleId = "Vai trò không được để trống!";
    if (!isEditing && !formData.Password) newErrors.Password = "Mật khẩu không được để trống!";
    else if (formData.Password && formData.Password.length < 8) newErrors.Password = "Mật khẩu phải có ít nhất 8 ký tự!";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const handleFormSubmit = async () => {
    if (!await validateForm()) return;

    try {
      const submitData = isEditing
        ? {
            id: editingId,
            ...formData,
            Password: formData.Password || undefined,
          }
        : formData;
  
      if (isEditing) {
        await AccountService.update(submitData);
        showAlert("Cập nhật tài khoản thành công!", "success");
      } else {
        await AccountService.register(submitData);
        showAlert("Đăng ký tài khoản thành công!", "success");
      }
  
      fetchAccounts();
      handleModalClose();
    } catch (error) {
      showAlert(error.message || "Lỗi khi lưu tài khoản!", "error");
    }
  };

  const handleResetPasswordDialogOpen = (accountId) => {
    setAccountToReset(accountId);
    setIsResetPasswordDialogOpen(true);
  };
  const handleResetPasswordDialogClose = () => {
    setAccountToReset(null);
    setIsResetPasswordDialogOpen(false);
  };

  const handleDisableAccountDialogOpen = async (accountId) => {
    let account = await AccountService.getById(accountId);
    setSelectedAccount(account);
    setAccountToDisable(accountId);
    setIsDisableAccountDialogOpen(true);
  };
  const handleDisableAccountDialogClose = () => {
    setAccountToDisable(null);
    setIsDisableAccountDialogOpen(false);
  };

  const handlePasswordReset = async () => {
    try {
      await AccountService.resetPassword(accountToReset);
      showAlert("Đặt lại mật khẩu thành công!", "success");
      fetchAccounts();
      handleResetPasswordDialogClose();
    } catch (error) {
      showAlert("Lỗi khi đặt lại mật khẩu!", "error");
    }
  };

  const handleAccountDisable = async () => {
    try {
      await AccountService.disableAccount(accountToDisable);
      const account = await AccountService.getById(accountToDisable)
      let message = "";
      account.isActive ? message = "Mở khóa tài khoản thành công!" : message = "Vô hiệu hóa tài khoản thành công!"
      showAlert(message, "success");
      fetchAccounts();
      handleDisableAccountDialogClose();
    } catch (error) {
      showAlert("Lỗi khi vô hiệu hóa tài khoản!", "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "50%", marginRight: 2 }}
        />
        <Button variant="contained" color="success" startIcon={<Add />} onClick={handleModalOpen}>
          Thêm tài khoản
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tên tài khoản</strong></TableCell>
              <TableCell><strong>Họ và tên</strong></TableCell>
              <TableCell><strong>Ngày sinh</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Vai trò</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.map((account) => {
              const role = roles.find((role) => role.id === account.roleID);
              return (
                <TableRow key={account.id}>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{formatDate(account.birthday)}</TableCell>
                  <TableCell>{account.isActive ? "Đang hoạt động" : "Đã bị khóa"}</TableCell>
                  <TableCell 
                    sx={{
                      color: role 
                        ? role.name === 'Admin' 
                          ? 'green'
                          : role.name === 'Staff' 
                          ? 'blue'
                          : 'black'
                        : 'gray',
                      fontWeight: 'bold'
                    }}
                  >
                    {role ? role.name : "Chưa có vai trò"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(account.id)}><Edit /></IconButton>
                    <IconButton color="secondary" onClick={() => handleResetPasswordDialogOpen(account.id)}><Restore /></IconButton>
                    <IconButton color={account.isActive ? "error" : "success"} onClick={() => handleDisableAccountDialogOpen(account.id)}>{account.isActive ? <Lock /> : <LockOpen />}</IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
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
        <DialogTitle>{isEditing ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên tài khoản"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Username"
                value={formData.Username}
                onChange={handleInputChange}
                error={!!errors.Username}
                helperText={errors.Username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                error={!!errors.Name}
                helperText={errors.Name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Birthday"
                type="date"
                value={formData.Birthday}
                onChange={handleInputChange}
                error={!!errors.Birthday}
                helperText={errors.Birthday}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
                error={!!errors.Phone}
                helperText={errors.Phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                error={!!errors.Email}
                helperText={errors.Email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mật khẩu"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleInputChange}
                error={!!errors.Password}
                helperText={errors.Password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="RoleId"
                  value={formData.RoleId}
                  onChange={handleInputChange}
                  error={!!errors.RoleId}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.RoleId && <p style={{ color: "red" }}>{errors.RoleId}</p>}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Hủy</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận reset mật khẩu */}
      <Dialog open={isResetPasswordDialogOpen} onClose={handleResetPasswordDialogClose}>
        <DialogTitle>Xác nhận đặt lại mật khẩu</DialogTitle>
        <DialogContent dividers>
          Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPasswordDialogClose}>Hủy</Button>
          <Button variant="contained" onClick={handlePasswordReset} color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận vô hiệu hóa tài khoản */}
      <Dialog open={isDisableAccountDialogOpen} onClose={handleDisableAccountDialogClose}>
        <DialogTitle>Xác nhận vô hiệu hóa tài khoản</DialogTitle>
        <DialogContent dividers>
            Bạn có chắc chắn muốn {selectedAccount?.isActive ? "vô hiệu hóa" : "mở khóa"} tài khoản này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisableAccountDialogClose} color={selectedAccount?.isActive ? "error" : "success"}>Hủy</Button>
          <Button variant="contained" onClick={handleAccountDisable} color={selectedAccount?.isActive ? "error" : "success"}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountComp;