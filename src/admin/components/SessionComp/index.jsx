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
  Grid,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import ExamSessionService from "~/admin/services/ExamSessionServices";

const SessionComp = () =>{
    const [session, setSession] = useState([]);
    const [filteredSession, setFilteredSession] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        course: "",
        examDay: "",
        regisStartDate: "",
        regisEndDate: "",
        dateAnnounResults: "",
        reEvalDate: "",
    });
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(false);

    const [helperText, setHelperText] = useState({
          name: "",
          course: "",
          examDay: "",
          regisStartDate: "",
          regisEndDate: "",
          dateAnnounResults: "",
          reEvalDate: "",
      });

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchSessions();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchSessions = async () => {
        try {
            const response = await ExamSessionService.getAll(debouncedSearch, true, rowsPerPage, page + 1);
            setSession(response.items);
            setTotalCount(response.totalCount);
            setFilteredSession(response.items);
        } catch (error) {
          showAlert("Lỗi khi tải đợt thi!", "error");
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
            name: "",
            course: "",
            examDay: "",
            regisStartDate: "",
            regisEndDate: "",
            dateAnnounResults: "",
            reEvalDate: "",
        });
        setIsEditing(false);
        setEditingId(null);
        setError(false);
        setHelperText("");
    };

    const handleEdit = async (examSessionId) => {
        try {
        const examSession = await ExamSessionService.getById(examSessionId);
        setIsEditing(true);
        setEditingId(examSession.id);
        setFormData({
            name: examSession.name || "",
            course: examSession.course || "",
            examDay: examSession.examDay || "",
            regisStartDate: examSession.regisStartDate || "",
            regisEndDate: examSession.regisEndDate || "",
            dateAnnounResults: examSession.dateAnnounResults || "",
            reEvalDate: examSession.reEvalDate || "",
        });
        handleModalOpen();
        } catch (error) {
            showAlert("Không thể tải dữ liệu đợt thi!", "error");
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        if (event.target.value.trim()) {
          setError(false);
          setHelperText("");
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
            const isRegistered = await ExamSessionService.checkRegistration(deletingId);
            console.log('isRegistered:', deletingId);
            if(isRegistered){
                showAlert("Không thể xóa đợt thi do đã có người đăng ký!", "error");
                handleDeleteDialogClose();
            }else{
                await ExamSessionService.delete(deletingId);
                showAlert("Xóa đợt thi thành công!", "success");
                fetchSessions();
                handleDeleteDialogClose();
            }
        } catch (error) {
            showAlert("Lỗi khi xóa đợt thi!", "error");
        }
    };

    const handleFormSubmit = async () => {
        setHelperText({
            name: "",
            course: "",
            examDay: "",
            regisStartDate: "",
            regisEndDate: "",
            dateAnnounResults: "",
            reEvalDate: "",
        });

        let hasError = false;

        if (!formData.name.trim()) {
            setHelperText((prev) => ({ ...prev, name: "Tên sinh viên không được bỏ trống!" }));
            hasError = true;
        }

        if (!formData.course.trim()) {
            setHelperText((prev) => ({ ...prev, course: "Khóa thi không được bỏ trống!" }));
            hasError = true;
        }else if(!/^\d+$/.test(formData.course.trim())){
            setHelperText((prev) => ({ ...prev, course: "Khóa thi phải là số!" }));
            hasError = true;
        }

        const normalizeDate = (date) => {
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        };
          

        const today = normalizeDate(new Date());

        if (!formData.examDay) {
            setHelperText((prev) => ({ ...prev, examDay: "Ngày thi không được bỏ trống!" }));
            hasError = true;
        } else if (normalizeDate(formData.examDay) < today) {
            setHelperText((prev) => ({ ...prev, examDay: "Ngày thi phải sau ngày hiện tại!" }));
            hasError = true;
        }
        
        if (!formData.regisStartDate) {
            setHelperText((prev) => ({ ...prev, regisStartDate: "Ngày mở đăng ký không được bỏ trống!" }));
            hasError = true;
        } else if (normalizeDate(formData.regisStartDate) < today) {
            setHelperText((prev) => ({ ...prev, regisStartDate: "Ngày mở đăng ký phải sau ngày hiện tại!" }));
            hasError = true;
        } else if (normalizeDate(formData.regisStartDate) > normalizeDate(formData.examDay)) {
            setHelperText((prev) => ({ ...prev, regisStartDate: "Ngày mở đăng ký phải trước ngày thi!" }));
            hasError = true;
        }
        
        if (!formData.regisEndDate) {
            setHelperText((prev) => ({ ...prev, regisEndDate: "Ngày đóng đăng ký không được bỏ trống!" }));
            hasError = true;
        } else if (normalizeDate(formData.regisEndDate) < normalizeDate(formData.regisStartDate)) {
            setHelperText((prev) => ({ ...prev, regisEndDate: "Ngày đóng đăng ký phải sau ngày mở đăng ký!" }));
            hasError = true;
        } else if (normalizeDate(formData.regisEndDate) > normalizeDate(formData.examDay)) {
            setHelperText((prev) => ({ ...prev, regisEndDate: "Ngày đóng đăng ký phải trước ngày thi!" }));
            hasError = true;
        }
        
        if (!formData.dateAnnounResults) {
            setHelperText((prev) => ({ ...prev, dateAnnounResults: "Ngày công bố kết quả không được bỏ trống!" }));
            hasError = true;
        } else if (normalizeDate(formData.dateAnnounResults) < normalizeDate(formData.examDay)) {
            setHelperText((prev) => ({ ...prev, dateAnnounResults: "Ngày công bố kết quả phải sau ngày thi!" }));
            hasError = true;
        }
        
        if (!formData.reEvalDate) {
            setHelperText((prev) => ({ ...prev, reEvalDate: "Hạn chót phúc khảo không được bỏ trống!" }));
            hasError = true;
        } else if (normalizeDate(formData.reEvalDate) < normalizeDate(formData.dateAnnounResults)) {
            setHelperText((prev) => ({ ...prev, reEvalDate: "Hạn chót phúc khảo phải sau ngày công bố kết quả!" }));
            hasError = true;
        }

        if (hasError) return;
    
        try {

          if (isEditing) {
            await ExamSessionService.update(editingId,{
                id: editingId,
                name: formData.name,
                course: formData.course,
                examDay: formData.examDay,
                regisStartDate: formData.regisStartDate,
                regisEndDate: formData.regisEndDate,
                isOpen: normalizeDate(formData.regisStartDate).getTime() === normalizeDate(new Date()).getTime(),
                dateAnnounResults: formData.dateAnnounResults,
                reEvalDate: formData.reEvalDate,
            });
            showAlert("Cập nhật đợt thi thành công!", "success");
          } else {
            await ExamSessionService.create({
                name: formData.name,
                course: formData.course,
                examDay: formData.examDay,
                regisStartDate: formData.regisStartDate,
                regisEndDate: formData.regisEndDate,
                isOpen: normalizeDate(formData.regisStartDate).getTime() === normalizeDate(new Date()).getTime(),
                dateAnnounResults: formData.dateAnnounResults,
                reEvalDate: formData.reEvalDate,
            });
            showAlert("Thêm đợt thi thành công!", "success");
          }
          fetchSessions();
          handleModalClose();
        } catch (error) {
          showAlert("Lỗi khi lưu đợt thi!", "error");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
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
                Thêm đợt thi
            </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell><strong>Tên đợt thi</strong></TableCell>
                    <TableCell><strong>Khóa thi</strong></TableCell>
                    <TableCell><strong>Ngày thi</strong></TableCell>
                    <TableCell><strong>Ngày mở đăng ký</strong></TableCell>
                    <TableCell><strong>Ngày đóng đăng ký</strong></TableCell>
                    <TableCell><strong>Trạng thái</strong></TableCell>
                    <TableCell><strong>Hành động</strong></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {filteredSession.map((session) => (
                    <TableRow key={session.id}>
                    <TableCell>{session.name}</TableCell>
                    <TableCell>{session.course}</TableCell>
                    <TableCell>{formatDate(session.examDay)}</TableCell>
                    <TableCell>{formatDate(session.regisStartDate)}</TableCell>
                    <TableCell>{formatDate(session.regisEndDate)}</TableCell>
                    <TableCell sx={{color: session.isOpen ? 'green' : 'red', fontWeight: 'bold'}}>{session.isOpen ? "Mở đăng ký" : "Đóng đăng ký"}</TableCell>
                    <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(session.id)}><Edit /></IconButton>
                        <IconButton color="secondary" onClick={() => handleDeleteDialogOpen(session.id)}><Delete /></IconButton>
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
                rowsPerPageOptions={[5, 10, 25, 100, 200]}
            />

            <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
            <DialogTitle><strong>{"Cập nhật đợt thi"}</strong></DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tên đợt thi"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (e.target.value.trim()) {
                                    setError(false);
                                    setHelperText({ ...helperText, name: "" });
                                }
                            }}
                        />
                        {helperText.name && <Box color="red">{helperText.name}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Khóa thi"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.course}
                            onChange={(e) => {
                                setFormData({ ...formData, course: e.target.value });
                                if (e.target.value.trim()) {
                                    setError(false);
                                    setHelperText({ ...helperText, course: "" });
                                }
                            }}
                        />
                        {helperText.course && <Box color="red">{helperText.course}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Ngày thi"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="ExamDay"
                        value={formatDateForInput(formData.examDay)}
                        onChange={(e) => {setFormData({ ...formData, examDay: e.target.value })
                            if (e.target.value) {
                                setError(false);
                                setHelperText({ ...helperText, examDay: "" });
                            }
                        }}
                        />
                        {helperText.examDay && <Box color="red">{helperText.examDay}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Ngày bắt đầu đăng ký"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="RegisStartDate"
                        value={formatDateForInput(formData.regisStartDate)}
                        onChange={(e) => {setFormData({ ...formData, regisStartDate: e.target.value })
                            if (e.target.value) {
                                setError(false);
                                setHelperText({ ...helperText, regisStartDate: "" });
                            }
                        }}
                        />
                        {helperText.regisStartDate && <Box color="red">{helperText.regisStartDate}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Ngày kết thúc đăng ký"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="RegisEndDate"
                        value={formatDateForInput(formData.regisEndDate)}
                        onChange={(e) => {setFormData({ ...formData, regisEndDate: e.target.value })
                            if (e.target.value) {
                                setError(false);
                                setHelperText({ ...helperText, regisEndDate: "" });
                            }
                        }}
                        />
                        {helperText.regisEndDate && <Box color="red">{helperText.regisEndDate}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Ngày thông báo kết quả"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="DateAnnounResults"
                        value={formatDateForInput(formData.dateAnnounResults)}
                        onChange={(e) => {setFormData({ ...formData, dateAnnounResults: e.target.value })
                            if (e.target.value) {
                                setError(false);
                                setHelperText({ ...helperText, dateAnnounResults: "" });
                            }
                        }}
                        />
                        {helperText.dateAnnounResults && <Box color="red">{helperText.dateAnnounResults}</Box>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Hạn chót phúc khảo"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        name="ReEvalDate"
                        value={formatDateForInput(formData.reEvalDate)}
                        onChange={(e) => {setFormData({ ...formData, reEvalDate: e.target.value })
                            if (e.target.value) {
                                setError(false);
                                setHelperText({ ...helperText, reEvalDate: "" });
                            }
                        }}
                        />
                        {helperText.reEvalDate && <Box color="red">{helperText.reEvalDate}</Box>}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose} color="primary">Hủy</Button>
                <Button variant="contained" onClick={handleFormSubmit} color="primary">{isEditing ? "Cập nhật" : "Thêm"}</Button>
            </DialogActions>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle><strong>Xác nhận xóa</strong></DialogTitle>
            <DialogContent dividers>
                <p>Bạn có chắc chắn muốn xóa kì thi này không?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteDialogClose} color="secondary">Hủy</Button>
                <Button onClick={handleDelete} variant="contained" color="error">Xóa</Button>
            </DialogActions>
            </Dialog>
        </Container>
    )
};

export default SessionComp