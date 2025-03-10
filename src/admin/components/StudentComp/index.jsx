import React, { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, TextField, Container, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Checkbox, FormControlLabel} from "@mui/material";
import { Edit, Delete, Add, Visibility, InsertDriveFile, Photo, PhotoCamera } from "@mui/icons-material";
import StudentService from "~/admin/services/StudentServices";
import ClassService from "~/admin/services/ClassServices";
import ExamSessionService from "~/admin/services/ExamSessionServices";
import RegisFormService from "~/admin/services/RegisFormServices";
import StatusRegisService from "~/admin/services/StatusRegisServices";
import DepartmentService from "~/admin/services/DepartmentServices";
import DeferredExamService from "~/admin/services/DeferredExamServices";

const StudentComp = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Avatar: "",
    Name: "",
    StudentCode: "",
    IdentNumber: "",
    DateIssue: "",
    PlaceIssue: "",
    Birthday: "",
    PlaceBirth: "",
    Sex: "",
    Nation: "",
    ITClass: "",
    Email: "",
    Contestants: "",
    Phone: "",
    ClassID: "",
    Department: "",
    ClassStudent: "",
    ImageBanking: "",
    RegisFormID: "",
  });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [selectedExamSession, setSelectedExamSession] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedStatusRegis, setSelectedStatusRegis] = useState("");
  const [openConfirmRegis, setOpenConfirmRegis] = useState(false);
  const [actionTypeConfirm, setActionTypeConfirm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    Avatar: "",
    Name: "",
    StudentCode: "",
    IdentNumber: "",
    DateIssue: "",
    PlaceIssue: "",
    Birthday: "",
    PlaceBirth: "",
    Sex: "",
    Nation: "",
    ITClass: "",
    Email: "",
    Contestants: "",
    Phone: "",
    ClassID: "",
  });

  const [provinces, setProvinces] = useState([
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ]);

  const [error, setError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchExamSessions();
    fetchStatuses();
    fetchDepartments();
  }, [page, rowsPerPage, debouncedSearch, selectedExamSession, selectedStatusRegis]);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await StudentService.getAll(selectedStatusRegis ,selectedExamSession, debouncedSearch, true, rowsPerPage, page + 1);
      setStudents(response.items);
      setTotalCount(response.totalCount);
      let studentsWithStatus = "";
      if(response.items.length !== 0){
        const regisForms = await RegisFormService.getByStudents(response.items.map(student => student.id));
        studentsWithStatus = response.items.map(student => ({
          ...student,
          status: regisForms.find(form => form.studentID === student.id)?.statusRegisID || null,
          imageBanking: regisForms.find(form => form.studentID === student.id)?.imageBanking || null,
        }));
      }else{
        studentsWithStatus = false;
      }
      setFilteredStudents(studentsWithStatus);
    } catch (error) {
      showAlert("Lỗi khi tải danh sách sinh viên!", "error");
    }
  }, [debouncedSearch, page, rowsPerPage, selectedExamSession, selectedStatusRegis]);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await ClassService.getAll(false);
      setClasses(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải danh sách lớp học!", "error");
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await DepartmentService.getAll(false);
      setDepartments(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải danh sách khoa!", "error");
    }
  }, []);

  const fetchExamSessions = useCallback(async () => {
    try {
      const response = await ExamSessionService.getAll("", false);
      setExamSessions(response.items);
    } catch (error) {
      showAlert("Lỗi khi tải danh sách đợt đánh giá!", "error");
    }
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await StatusRegisService.getAll(false);
      setStatuses(response.items);
    } catch (error) {
      console.error("Lỗi khi tải danh sách trạng thái", error);
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleExamSessionChange = (event) => {
    setSelectedExamSession(event.target.value);
  };

  const handleEditModalOpen = async (studentId = null) => {
      await handleLoadStudentForEdit(studentId);
      setIsEditModalOpen(true);
  };

  const handleLoadStudentForEdit = async (studentId) => {
    try {
      const student = await StudentService.getById(studentId);
      await fetchDepartments();
      await fetchClasses();
      const studentClass = classes.find((cls) => cls.id === student.classID);
      const regisForms = await RegisFormService.getByStudents([studentId]);

      const sttID = regisForms.find(form => form.studentID === studentId)?.statusRegisID || null;
      const stt = await StatusRegisService.getById(sttID);
      const imagebk = regisForms.find(form => form.studentID === studentId)?.imageBanking || ""

      if (regisForms.length > 0) {
        const regisFormId = regisForms[0].id;
  
        const deferredExams = await DeferredExamService.getByRegisFormID(regisFormId);
  
        if (deferredExams.length > 0) {
          const deferredExam = deferredExams[0];
          setEditFormData({
            ID: student.id,
            Avatar: student.avatar || "",
            Name: student.name || "",
            StudentCode: student.studentCode || "",
            IdentNumber: student.identNumber || "",
            DateIssue: formatDateForInput(student.dateIssue),
            PlaceIssue: student.placeIssue || "",
            Birthday: formatDateForInput(student.birthday),
            PlaceBirth: student.placeBirth || "",
            Sex: student.sex || "",
            Nation: student.nation || "",
            ITClass: student.itClass || "",
            Email: student.email || "",
            Contestants: student.contestants || "",
            Phone: student.phone || "",
            ClassID: student.classID || "",
            DepartmentID: studentClass ? studentClass.departmentID : "",
            HasDeferredExam: true,
            PrevExamDay: formatDateForInput(deferredExam.prevExamDay),
            DeferredSubject: deferredExam.deferredSubject || "",
            ResitSubject: deferredExam.resitSubject || "",
            ImageBanking: imagebk,
            ExamSessionID: regisForms[0].examSessionID,
            StatusRegisID: regisForms[0].statusRegisID,
            RegisFormID: regisForms[0].id,
            DeferredExamID: deferredExam.id,
          });
        }
        else {
          setEditFormData({
            ID: student.id,
            Avatar: student.avatar || "",
            Name: student.name || "",
            StudentCode: student.studentCode || "",
            IdentNumber: student.identNumber || "",
            DateIssue: formatDateForInput(student.dateIssue),
            PlaceIssue: student.placeIssue || "",
            Birthday: formatDateForInput(student.birthday),
            PlaceBirth: student.placeBirth || "",
            Sex: student.sex || "",
            Nation: student.nation || "",
            ITClass: student.itClass || "",
            Email: student.email || "",
            Contestants: student.contestants || "",
            Phone: student.phone || "",
            ClassID: student.classID || "",
            DepartmentID: studentClass ? studentClass.departmentID : "",
            HasDeferredExam: false,
            ImageBanking: imagebk,
            ExamSessionID: regisForms[0].examSessionID,
            StatusRegisID: regisForms[0].statusRegisID,
            RegisFormID: regisForms[0].id,
          });
        }
      }

    } catch (error) {
      showAlert("Không thể tải dữ liệu sinh viên!", "error");
    }
  };

  const handleViewDetails = async (studentId) => {
    try {
      const student = await StudentService.getById(studentId);
      const regisForm = await RegisFormService.getByStudents([studentId]);
      const sttID = regisForm.find(form => form.studentID === studentId)?.statusRegisID || null;
      const stt = await StatusRegisService.getById(sttID);
      const classStudent = await ClassService.getById(student.classID);
      const department = await DepartmentService.getById(classStudent.departmentID);
      const imagebk = regisForm.find(form => form.studentID === studentId)?.imageBanking || ""
      setFormData({
        Avatar: student.avatar || "",
        Name: student.name || "",
        StudentCode: student.studentCode || "",
        IdentNumber: student.identNumber || "",
        DateIssue: student.dateIssue || "",
        PlaceIssue: student.placeIssue || "",
        Birthday: student.birthday || "",
        PlaceBirth: student.placeBirth || "",
        Sex: student.sex || "",
        Nation: student.nation || "",
        ITClass: student.itClass || "",
        Email: student.email || "",
        Contestants: student.contestants || "",
        Phone: student.phone || "",
        ClassID: student.classID || "",
        Status: stt.name || "",
        Department: department.name || "",
        ClassStudent: classStudent.name ||"",
        ImageBanking: imagebk,
        RegisFormID: regisForm[0].id,
        StatusRegisID: sttID,
      });
      setIsDetailsModalOpen(true);
    } catch (error) {
      showAlert("Không thể tải dữ liệu sinh viên!", "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleConfirmRegis = async (regisFormId, typeConfirm) =>{
    try{
      const conFirmRegis = await RegisFormService.confirmRegis(regisFormId, typeConfirm);
      showAlert("Xác nhận trạng thái đăng ký thành công!", "success");
      handleModalDetailClose();
      fetchStudents();
    }
    catch(error){
      showAlert("Lỗi! Xác nhận trạng thái đăng ký không thành công!", "error");
    }
  }

  const handleOpenDialogConfirmRegis = (type) => {
    setActionTypeConfirm(type);
    setOpenConfirmRegis(true);
  };

  const handleCloseConfirmRegis = () => {
    setOpenConfirmRegis(false);
  };

  const handleConfirm = () => {
    handleConfirmRegis(formData.RegisFormID, actionTypeConfirm);
    setOpenConfirmRegis(false);
  };

  const handleExamEntryTicket = async () => {
    if (selectedStudents.length === 0) {
      showAlert("Vui lòng chọn ít nhất một sinh viên!", "warning");
      return;
    }
    
    const studentsList = await StudentService.getAll("" ,"", "", false);
    let selectedStudentDetails = studentsList.items.filter((student) =>
      selectedStudents.includes(student.id)
    );

    selectedStudentDetails = await Promise.all(selectedStudentDetails.map(student => studentForExportWord(student)));
    
    try {
      let studentsZip = await StudentService.generateExamRegistrationZip(selectedStudentDetails);

      if (selectedStudentDetails.length === 1) {
        showAlert("Xuất file thành công!", "success");
        const blob = new Blob([studentsZip], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedStudentDetails[0].name + "-" + selectedStudentDetails[0].identNumber}.docx`);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } else if (studentsZip) {
        showAlert("Xuất file thành công!", "success");
        const blob = new Blob([studentsZip], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ExamRegistrations.zip');
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Lỗi khi xuất file:", error);
      showAlert("Lỗi khi xuất file!", "error");
    }
  };

  const studentForExportWord = async (student) => {
    try{
      const classStudent = await ClassService.getById(student.classID);
      const departmentStudent = await DepartmentService.getById(classStudent.departmentID);
      const regisFormStudent = await RegisFormService.getByStudents([student.id]);
      const examSessionStudent = await ExamSessionService.getById(regisFormStudent[0].examSessionID);
      const deferredExamStudent = await DeferredExamService.getByRegisFormID(regisFormStudent[0].id);
      const deferredExam = deferredExamStudent.length > 0 ? deferredExamStudent[0] : {};
      return {
        ...student,
        ClassStudent: classStudent.name,
        DepartmentName: departmentStudent.name,
        RegisDate: regisFormStudent[0].regisDate,
        Level: regisFormStudent[0].level,
        Course: examSessionStudent.course,
        ExamDay: examSessionStudent.examDay,
        PrevExamDay: deferredExam.prevExamDay || null,
        DeferredSubject: deferredExam.deferredSubject || null,
        ResitSubject: deferredExam.resitSubject || null
      }
    }catch(error){
      showAlert("Lỗi không thể tải dữ liệu phiếu dự thi", "error");
    }
  } 

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedStudents(event.target.checked ? students.map((s) => s.id) : []);
  };

  const splitFullName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(" ");
    const firstName = parts.pop();
    const lastName = parts.join(" ");
    return { firstName, lastName };
  };

  const handleExportExcel = async () => {
    if (!selectedExamSession) {
      showAlert("Vui lòng chọn đợt thi!", "error");
      return;
    }

    try {
      const students = await StudentService.getStudentsForExamList(selectedExamSession);
      if (!students.length) {
        showAlert("Không có thí sinh nào trong danh sách.", "error");
        return;
      }

      const regisForm = await RegisFormService.getByStudents([students[0].id]);
      let examSession = await ExamSessionService.getById(regisForm[0].examSessionID);
      let examDay = examSession.examDay ? new Date(examSession.examDay).toLocaleDateString("vi-VN") : "";

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách dự thi");

      const title = `DANH SÁCH DỰ THI ỨNG DỤNG CNTT CƠ BẢN NGÀY ${examDay}`;
      const titleRow = worksheet.addRow([title]);
      worksheet.mergeCells("A1:K1"); // Gộp ô tiêu đề
      titleRow.font = { name: "Times New Roman", size: 13, bold: true }; // In đậm
      titleRow.alignment = { horizontal: "center", vertical: "middle" };

      const headerRow = worksheet.addRow([
        "STT", "Họ", "Tên", "MSSV/CMND", "Giới tính", "Dân tộc", "Ngày sinh",
        "Nơi sinh", "Email", "Điện thoại", "Ghi chú"
      ]);
      headerRow.font = { name: "Times New Roman", size: 13, bold: true };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };

      students.sort((a, b) => {
        const nameA = splitFullName(a.name).lastName.toLowerCase();
        const nameB = splitFullName(b.name).lastName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      students.forEach((student, index) => {
        const { firstName, lastName } = splitFullName(student.name);
        const row = worksheet.addRow([
          index + 1, lastName, firstName, student.studentCode || student.identNumber, 
          student.sex, student.nation, student.birthday ? new Date(student.birthday) : "", 
          student.placeBirth, student.email, student.phone, ""
        ]);
        row.font = { name: "Times New Roman", size: 13 };
        const birthdayCell = row.getCell(7);
        if (birthdayCell.value instanceof Date) {
          birthdayCell.numFmt = 'DD/MM/YYYY';
        }
      });

      worksheet.columns = [
        { key: 'STT', width: 5, alignment: { horizontal: 'center' } },
        { key: 'Họ', width: 20, alignment: { horizontal: 'left' } },
        { key: 'Tên', width: 10, alignment: { horizontal: 'left' } },
        { key: 'MSSV/CMND', width: 15, alignment: { horizontal: 'left' } },
        { key: 'Giới tính', width: 10, alignment: { horizontal: 'left' } },
        { key: 'Dân tộc', width: 10, alignment: { horizontal: 'left' } },
        { key: 'Ngày sinh', width: 15, alignment: { horizontal: 'left' } },
        { key: 'Nơi sinh', width: 15, alignment: { horizontal: 'left' } },
        { key: 'Email', width: 35, alignment: { horizontal: 'left' } },
        { key: 'Điện thoại', width: 15, alignment: { horizontal: 'left' } },
        { key: 'Ghi chú', width: 10, alignment: { horizontal: 'left' } }
      ];

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin" }, left: { style: "thin" },
            bottom: { style: "thin" }, right: { style: "thin" }
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `DanhSachDuThiUDCNTTCB_${examDay}.xlsx`);

      showAlert("Xuất danh sách thành công!", "success");
    } catch (error) {
      showAlert("Chưa có thí sinh tham gia kỳ thi!", "error");
    }
  };
  
  const handleStatusRegisChange = (event) => {
    setSelectedStatusRegis(event.target.value);
  }

  const handleExportImages = async () => {
    if (selectedStudents.length === 0) {
      showAlert("Vui lòng chọn ít nhất một thí sinh!", "error");
      return;
    }
  
    try {
      const blob = await StudentService.exportStudentImages(selectedStudents);
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      showAlert("Xuất ảnh thí sinh thành công!", "success");
    } catch (error) {
      console.error("Lỗi khi xuất ảnh thí sinh:", error);
      showAlert("Lỗi khi xuất ảnh thí sinh!", "error");
    }
  };

  const handleSaveStudent = async () => {
    setHelperText({
      Name: "",
      StudentCode: "",
      Avatar: "",
      IdentNumber: "",
      DateIssue: "",
      PlaceIssue: "",
      Birthday: "",
      PlaceBirth: "",
      Sex: "",
      Nation: "",
      ITClass: "",
      Email: "",
      Contestants: "",
      Phone: "",
      Department: "",
      ClassStudent: "",
      PrevExamDay: "",
      DeferredSubject: "",
      ResitSubject: ""
    });

    let hasError = false;

    if (!editFormData.Name.trim()) {
      setHelperText((prev) => ({ ...prev, Name: "Tên sinh viên không được bỏ trống!" }));
      hasError = true;
    }

    if (!editFormData.IdentNumber.trim()) {
      setHelperText((prev) => ({ ...prev, IdentNumber: "Số CCCD không được bỏ trống!" }));
      hasError = true;
    }else if(!/^\d+$/.test(editFormData.IdentNumber.trim())){
      setHelperText((prev) => ({ ...prev, IdentNumber: "CCCD phải là số!" }));
      hasError = true;
    }else if(editFormData.IdentNumber.trim().length !== 12){
      setHelperText((prev) => ({ ...prev, IdentNumber: "CCCD phải đủ 12 số!" }));
      hasError = true;
    }

    if(!/^\d+$/.test(editFormData.StudentCode.trim()) && editFormData.StudentCode.trim()){
      setHelperText((prev) => ({ ...prev, StudentCode: "Mã sinh viên phải là số!" }));
      hasError = true;
    }

    const today = new Date();

    if (!editFormData.DateIssue) {
      setHelperText((prev) => ({ ...prev, DateIssue: "Ngày cấp không được bỏ trống!" }));
      hasError = true;
    }else if(new Date(editFormData.DateIssue) > today){
      setHelperText((prev) => ({ ...prev, DateIssue: "Ngày cấp phải trước ngày hiện tại!" }));
      hasError = true;
    }

    if (!editFormData.PlaceIssue.trim()) {
      setHelperText((prev) => ({ ...prev, PlaceIssue: "Nơi cấp không được bỏ trống!" }));
      hasError = true;
    }

    if (!editFormData.Birthday) {
      setHelperText((prev) => ({ ...prev, Birthday: "Ngày sinh không được bỏ trống!" }));
      hasError = true;
    }else if(new Date(editFormData.Birthday) > today){
      setHelperText((prev) => ({ ...prev, Birthday: "Ngày sinh phải trước ngày hiện tại!" }));
      hasError = true;
    }

    if (!editFormData.PlaceBirth) {
      setHelperText((prev) => ({ ...prev, PlaceBirth: "Nơi sinh không được bỏ trống!" }));
      hasError = true;
    }

    if (!editFormData.Sex) {
      setHelperText((prev) => ({ ...prev, Sex: "Giới tính không được bỏ trống!" }));
      hasError = true;
    }

    if (!editFormData.Nation.trim()) {
      setHelperText((prev) => ({ ...prev, Nation: "Dân tộc không được bỏ trống!" }));
      hasError = true;
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!editFormData.Email.trim()) {
      setHelperText((prev) => ({ ...prev, Email: "Email không được bỏ trống!" }));
      hasError = true;
    }else if(!isValidEmail(editFormData.Email)){
      setHelperText((prev) => ({ ...prev, Email: "Email không hợp lệ!" }));
      hasError = true;
    }

    if (!editFormData.Contestants) {
      setHelperText((prev) => ({ ...prev, Contestants: "Đối tượng dự thi không được bỏ trống!" }));
      hasError = true;
    }

    if (!editFormData.Phone.trim()) {
      setHelperText((prev) => ({ ...prev, Phone: "Số điện thoại không được bỏ trống!" }));
      hasError = true;
    }else if(!/^\d+$/.test(editFormData.Phone.trim())){
      setHelperText((prev) => ({ ...prev, Phone: "Số điện thoại phải là số!" }));
      hasError = true;
    }else if(editFormData.Phone.trim().length < 10 || editFormData.Phone.trim().length > 12){
      setHelperText((prev) => ({ ...prev, Phone: "Số điện thoại phải từ 10 đến 12 số!" }));
      hasError = true;
    }

    if (!editFormData.DepartmentID && editFormData.ClassID) {
      setHelperText((prev) => ({ ...prev, Department: "Vui lòng chọn khoa!" }));
      hasError = true;
    }

    if (editFormData.DepartmentID && !editFormData.ClassID) {
      setHelperText((prev) => ({ ...prev, ClassStudent: "Vui lòng chọn lớp!" }));
      hasError = true;
    }

    if(editFormData.HasDeferredExam){
      if (!editFormData.PrevExamDay) {
        setHelperText((prev) => ({ ...prev, PrevExamDay: "Ngày thi đầu tiên không được bỏ trống!" }));
        hasError = true;
      }else if(new Date(editFormData.PrevExamDay) > today){
        setHelperText((prev) => ({ ...prev, PrevExamDay: "Ngày thi đầu tiên không hợp lệ!" }));
        hasError = true;
      }

      if(!editFormData.DeferredSubject){
        setHelperText((prev) => ({ ...prev, DeferredSubject: "Môn bảo lưu không được bỏ trống!" }));
        hasError = true;
      }else if(/^\d+$/.test(editFormData.DeferredSubject.trim())){
        setHelperText((prev) => ({ ...prev, DeferredSubject: "Môn bảo lưu không được chứa số!" }));
        hasError = true;
      }

      if(!editFormData.ResitSubject){
        setHelperText((prev) => ({ ...prev, ResitSubject: "Môn thi lại không được bỏ trống!" }));
        hasError = true;
      }else if(/^\d+$/.test(editFormData.ResitSubject.trim())){
        setHelperText((prev) => ({ ...prev, ResitSubject: "Môn thi lại không được chứa số!" }));
        hasError = true;
      }
    }

    if (hasError) return;
    
    try {
      const avatarUrl = await handleUploadAvatar(editFormData.Avatar);
  
      const updatedStudentData = {
        id: editFormData.ID,
        name: editFormData.Name,
        studentCode: editFormData.StudentCode,
        identNumber: editFormData.IdentNumber,
        dateIssue: editFormData.DateIssue,
        placeIssue: editFormData.PlaceIssue,
        birthday: editFormData.Birthday,
        placeBirth: editFormData.PlaceBirth,
        sex: editFormData.Sex,
        nation: editFormData.Nation,
        itClass: editFormData.ITClass,
        avatar: avatarUrl,
        email: editFormData.Email,
        contestants: editFormData.Contestants,
        phone: editFormData.Phone,
        classID: editFormData.ClassID || null,
      };
  
      await StudentService.update(updatedStudentData);
  
      const updatedRegisFormData = {
        id: editFormData.RegisFormID,
        regisDate: new Date().toISOString(),
        isNewRegis: !editFormData.HasDeferredExam,
        level: "Ứng dụng Công nghệ thông tin Cơ bản",
        imageBanking: editFormData.ImageBanking,
        studentID: editFormData.ID,
        examSessionID: editFormData.ExamSessionID,
        statusRegisID: editFormData.StatusRegisID,
      };
  
      await RegisFormService.update(updatedRegisFormData);
  
      if (editFormData.HasDeferredExam) {
        const deferredExamData = {
          prevExamDay: editFormData.PrevExamDay,
          deferredSubject: editFormData.DeferredSubject,
          resitSubject: editFormData.ResitSubject,
          regisFormID: editFormData.RegisFormID,
        };
  
        if (editFormData.DeferredExamID) {
          await DeferredExamService.update({
            id: editFormData.DeferredExamID,
            ...deferredExamData,
          });
        } else {
          const newDeferredExam = await DeferredExamService.create(deferredExamData);
          setEditFormData((prevData) => ({
            ...prevData,
            DeferredExamID: newDeferredExam.id,
          }));
        }
      } else if (editFormData.DeferredExamID) {
        await DeferredExamService.delete(editFormData.DeferredExamID);
        setEditFormData((prevData) => ({
          ...prevData,
          DeferredExamID: null,
        }));
      }
  
      showAlert("Cập nhật thông tin thí sinh thành công!", "success");
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      showAlert("Lỗi khi cập nhật thông tin thí sinh!", "error");
    }
  };

  const handleModalDetailClose = async () => {
    setIsDetailsModalOpen(false);
  }

  const fetchClassesByDepartment = async (departmentId) => {
    try {
      const response = await ClassService.getAll(false);
      const filteredClasses = response.items.filter((cls) => cls.departmentID === departmentId);
      setClasses(filteredClasses);
    } catch (error) {
      showAlert("Lỗi khi tải danh sách lớp!", "error");
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditFormData({
      Name: "",
      StudentCode: "",
      IdentNumber: "",
      DateIssue: "",
      PlaceIssue: "",
      Birthday: "",
      PlaceBirth: "",
      Sex: "",
      Nation: "",
      ITClass: "",
      Email: "",
      Contestants: "",
      Phone: "",
      ClassID: "",
      DepartmentID: "",
      ExamSessionID: "",
      HasDeferredExam: false,
      PrevExamDay: "",
      DeferredSubject: "",
      ResitSubject: "",
    });
    setError(false);
    setHelperText("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({ ...editFormData, Avatar: file });
    }
  };

  const handleUploadAvatar = async (avatar) => {
    if (avatar instanceof File) {
      return await StudentService.uploadImage(avatar);
    }
    return avatar;
  };

  const [helperText, setHelperText] = useState({
      Name: "",
      StudentCode: "",
      Avatar: "",
      IdentNumber: "",
      DateIssue: "",
      PlaceIssue: "",
      Birthday: "",
      PlaceBirth: "",
      Sex: "",
      Nation: "",
      ITClass: "",
      Email: "",
      Contestants: "",
      Phone: "",
      Department: "",
      ClassStudent: "",
      PrevExamDay: "",
      DeferredSubject: "",
      ResitSubject: "",
  });

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
      await StudentService.delete(deletingId);
      const regisForm = await RegisFormService.getByStudents([deletingId]);
      await RegisFormService.delete(regisForm[0].id);
      const deferredExam = await DeferredExamService.getByRegisFormID(regisForm[0].id);
      if(Object.keys(deferredExam).length !== 0){
        await DeferredExamService.delete(deferredExam[0].id);
      }
      showAlert("Xóa thông tin thí sinh thành công!", "success");
      fetchStudents();
      handleDeleteDialogClose();
    } catch (error) {
      showAlert("Lỗi khi xóa thông tin thí sinh!", "error");
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
          onChange={handleSearchChange}
          sx={{ width: "30%", marginRight: 1 }}
        />
        <FormControl sx={{ minWidth: 300, marginRight: 1, maxWidth: 300 }}>
          <InputLabel>Đợt thi</InputLabel>
          <Select
            value={selectedExamSession}
            onChange={handleExamSessionChange}
            label="Đợt thi"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {examSessions.map((session) => (
              <MenuItem key={session.id} value={session.id}>
                {session.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150, marginRight: 1, maxWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={selectedStatusRegis}
            onChange={handleStatusRegisChange}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                  checked={selectedStudents.length === students.length && students.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><strong>Ảnh đại diện</strong></TableCell>
              <TableCell><strong>Họ tên</strong></TableCell>
              <TableCell><strong>Mã sinh viên/CCCD</strong></TableCell>
              <TableCell><strong>Ngày sinh</strong></TableCell>
              <TableCell><strong>Giới tính</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents && filteredStudents.map((student) => (
              <TableRow key={student.id} selected={selectedStudents.includes(student.id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} />
                </TableCell>
                <TableCell align="center">
                  <img
                    src={process.env.REACT_APP_API_BASE_URL + student.avatar}
                    alt="Không tìm thấy"
                    style={{ maxWidth: "100%", maxHeight: "70px" }}
                  />
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.studentCode || student.identNumber}</TableCell>
                <TableCell>{formatDate(student.birthday)}</TableCell>
                <TableCell>{student.sex}</TableCell>
                <TableCell 
                  sx={{
                    color: student.status 
                      ? statuses.find((status) => status.id === student.status)?.name === 'Đã duyệt' 
                        ? 'green' 
                        : statuses.find((status) => status.id === student.status)?.name === 'Đã đăng ký' 
                        ? 'blue' 
                        : 'red'
                      : 'gray',
                    fontWeight: 'bold'
                  }}
                >
                  {student.status 
                    ? statuses.find((status) => status.id === student.status)?.name 
                    : "Chưa xác định"}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleViewDetails(student.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditModalOpen(student.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteDialogOpen(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100, 200, 300, 500]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <Box sx={{display: "flex", justifyContent: "flex-end", gap: "8px"}}>
        <Button
          variant="contained"
          color="success"
          startIcon={<InsertDriveFile />}
          onClick={() => handleExportExcel()}
        >
          Xuất DS
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<InsertDriveFile />}
          onClick={() => handleExamEntryTicket()}
        >
          Xuất phiếu
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Photo />}
          onClick={() => handleExportImages()}
        >
          Xuất file ảnh
        </Button>
      </Box>

      <Dialog open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle><strong>Thông tin sinh viên</strong></DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
              <img
                src={process.env.REACT_APP_API_BASE_URL + formData.Avatar}
                alt="Không tìm thấy"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", objectFit: "cover" }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Họ tên: </strong>{formData.Name}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Mã sinh viên: </strong>{formData.StudentCode}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Ngày sinh: </strong>{formatDate(formData.Birthday)}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Nơi sinh: </strong>{formData.PlaceBirth}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Giới tính: </strong>{formData.Sex}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Dân tộc: </strong>{formData.Nation}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Lớp: </strong>{formData.ClassStudent}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Khoa: </strong>{formData.Department}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Email: </strong>{formData.Email}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Số điện thoại: </strong>{formData.Phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Số CCCD: </strong>{formData.IdentNumber}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Ngày cấp: </strong>{formatDate(formData.DateIssue)}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Nơi cấp: </strong>{formData.PlaceIssue}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Lớp tin học: </strong>{formData.ITClass}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Đối tượng dự thi: </strong>{formData.Contestants}</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}><strong>Trạng thái: </strong>{formData.Status}</Typography>
            </Grid>

            <Grid item xs={12} sm={4} style={{display: "flex", justifyContent: "center"}}>
              <img
                src={process.env.REACT_APP_API_BASE_URL + formData.ImageBanking}
                alt="Không tìm thấy"
                style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "8px", objectFit: "cover" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalDetailClose} color="primary">Đóng</Button>
          {formData.StatusRegisID === 2 && (
            <>
              <Button onClick={() => handleOpenDialogConfirmRegis("Cancel")} variant="contained" color="error">
                Hủy đăng ký
              </Button>
              <Button onClick={() => handleOpenDialogConfirmRegis("Confirm")} variant="contained" color="primary">
                Duyệt
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmRegis} onClose={handleCloseConfirmRegis}>
        <DialogTitle><strong>Xác nhận</strong></DialogTitle>
        <DialogContent dividers>
            {actionTypeConfirm === "Confirm"
              ? "Bạn có chắc muốn duyệt thí sinh này?"
              : "Bạn có chắc muốn hủy đăng ký thí sinh này?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmRegis} color={actionTypeConfirm === "Confirm" ? "primary" : "error"}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} color={actionTypeConfirm === "Confirm" ? "primary" : "error"} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleEditModalClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <strong>{"Cập nhật thông tin thí sinh"}</strong>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>

          <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>

              {editFormData.Avatar && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={editFormData.Avatar instanceof File ? URL.createObjectURL(editFormData.Avatar) : process.env.REACT_APP_API_BASE_URL + editFormData.Avatar}
                    alt="Selected"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </Box>
              )}
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                width= "30%"
              >
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ tên"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Name"
                value={editFormData.Name}
                onChange={(e) => {setEditFormData({ ...editFormData, Name: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, Name: "" });
                  }
                }}
              />
              {helperText.Name && <Box color="red">{helperText.Name}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Mã sinh viên"
                variant="outlined"
                fullWidth
                margin="normal"
                name="StudentCode"
                value={editFormData.StudentCode}
                onChange={(e) => {setEditFormData({ ...editFormData, StudentCode: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, StudentCode: "" });
                  }
                }}
              />
              {helperText.StudentCode && <Box color="red">{helperText.StudentCode}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Số CCCD"
                variant="outlined"
                fullWidth
                margin="normal"
                name="IdentNumber"
                value={editFormData.IdentNumber}
                onChange={(e) => {setEditFormData({ ...editFormData, IdentNumber: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, IdentNumber: "" });
                  }
                }}
              />
              {helperText.IdentNumber && <Box color="red">{helperText.IdentNumber}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày cấp"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                name="DateIssue"
                value={editFormData.DateIssue}
                onChange={(e) => {setEditFormData({ ...editFormData, DateIssue: e.target.value })
                  if (e.target.value) {
                    setError(false);
                    setHelperText({ ...helperText, DateIssue: "" });
                  }
                }}
              />
              {helperText.DateIssue && <Box color="red">{helperText.DateIssue}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nơi cấp"
                variant="outlined"
                fullWidth
                margin="normal"
                name="PlaceIssue"
                value={editFormData.PlaceIssue}
                onChange={(e) => {setEditFormData({ ...editFormData, PlaceIssue: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, PlaceIssue: "" });
                  }
                }}
              />
              {helperText.PlaceIssue && <Box color="red">{helperText.PlaceIssue}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                name="Birthday"
                value={editFormData.Birthday}
                onChange={(e) => {setEditFormData({ ...editFormData, Birthday: e.target.value })
                  if (e.target.value) {
                    setError(false);
                    setHelperText({ ...helperText, Birthday: "" });
                  }
                }}
              />
              {helperText.Birthday && <Box color="red">{helperText.Birthday}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Nơi sinh</InputLabel>
                <Select
                  label="Nơi sinh"
                  name="PlaceBirth"
                  value={editFormData.PlaceBirth}
                  onChange={(e) => {setEditFormData({ ...editFormData, PlaceBirth: e.target.value })
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, PlaceBirth: "" });
                    }
                  }}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {helperText.PlaceBirth && <Box color="red">{helperText.PlaceBirth}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  label="Giới tính"
                  name="Sex"
                  value={editFormData.Sex}
                  onChange={(e) => {setEditFormData({ ...editFormData, Sex: e.target.value })
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, Sex: "" });
                    }
                  }}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
              {helperText.Sex && <Box color="red">{helperText.Sex}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Dân tộc"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Nation"
                value={editFormData.Nation}
                onChange={(e) => {setEditFormData({ ...editFormData, Nation: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, Nation: "" });
                  }
                }}
              />
              {helperText.Nation && <Box color="red">{helperText.Nation}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Lớp tin học"
                variant="outlined"
                fullWidth
                margin="normal"
                name="ITClass"
                value={editFormData.ITClass}
                onChange={(e) => {setEditFormData({ ...editFormData, ITClass: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, ITClass: "" });
                  }
                }}
              />
              {helperText.ITClass && <Box color="red">{helperText.ITClass}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Email"
                value={editFormData.Email}
                onChange={(e) => {setEditFormData({ ...editFormData, Email: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, Email: "" });
                  }
                }}
              />
              {helperText.Email && <Box color="red">{helperText.Email}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Đối tượng dự thi</InputLabel>
                <Select
                  label="Đối tượng dự thi"
                  name="Contestants"
                  value={editFormData.Contestants}
                  onChange={(e) => {setEditFormData({ ...editFormData, Contestants: e.target.value })
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, Contestants: "" });
                    }
                  }}
                >
                  <MenuItem value="Thí sinh tự do">Thí sinh tự do</MenuItem>
                  <MenuItem value="Học viên">Học viên</MenuItem>
                </Select>
              </FormControl>
              {helperText.Contestants && <Box color="red">{helperText.Contestants}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                variant="outlined"
                fullWidth
                margin="normal"
                name="Phone"
                value={editFormData.Phone}
                onChange={(e) => {setEditFormData({ ...editFormData, Phone: e.target.value })
                  if (e.target.value.trim()) {
                    setError(false);
                    setHelperText({ ...helperText, Phone: "" });
                  }
                }}
              />
              {helperText.Phone && <Box color="red">{helperText.Phone}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Khoa</InputLabel>
                <Select
                  label="Khoa"
                  name="DepartmentID"
                  value={editFormData.DepartmentID || ""}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, DepartmentID: e.target.value });
                    fetchClassesByDepartment(e.target.value);
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, Department: "" });
                    }
                  }}
                >
                  <MenuItem value="">
                      {"Khác"}
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {helperText.Department && <Box color="red">{helperText.Department}</Box>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Lớp</InputLabel>
                <Select
                  label="Lớp"
                  name="ClassID"
                  value={editFormData.ClassID || ""}
                  onChange={(e) => {setEditFormData({ ...editFormData, ClassID: e.target.value })
                    if (e.target.value) {
                      setError(false);
                      setHelperText({ ...helperText, ClassStudent: "" });
                    }
                  }}
                >
                  <MenuItem value="">
                      {"Khác"}
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {helperText.ClassStudent && <Box color="red">{helperText.ClassStudent}</Box>}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editFormData.HasDeferredExam}
                    onChange={(e) => setEditFormData({ ...editFormData, HasDeferredExam: e.target.checked })}
                  />
                }
                label="Có bảo lưu không?"
              />
            </Grid>

            {editFormData.HasDeferredExam && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ngày thi đầu tiên"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    name="PrevExamDay"
                    value={editFormData.PrevExamDay}
                    onChange={(e) => {setEditFormData({ ...editFormData, PrevExamDay: e.target.value })
                      if (e.target.value) {
                        setError(false);
                        setHelperText({ ...helperText, PrevExamDay: "" });
                      }
                    }}
                  />
                  {helperText.PrevExamDay && <Box color="red">{helperText.PrevExamDay}</Box>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Môn bảo lưu"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="DeferredSubject"
                    value={editFormData.DeferredSubject}
                    onChange={(e) => {setEditFormData({ ...editFormData, DeferredSubject: e.target.value })
                      if (e.target.value.trim()) {
                        setError(false);
                        setHelperText({ ...helperText, DeferredSubject: "" });
                      }
                    }}
                  />
                  {helperText.DeferredSubject && <Box color="red">{helperText.DeferredSubject}</Box>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Môn thi lại"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="ResitSubject"
                    value={editFormData.ResitSubject}
                    onChange={(e) => {setEditFormData({ ...editFormData, ResitSubject: e.target.value })
                      if (e.target.value.trim()) {
                        setError(false);
                        setHelperText({ ...helperText, ResitSubject: "" });
                      }
                    }}
                  />
                  {helperText.ResitSubject && <Box color="red">{helperText.ResitSubject}</Box>}
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose} color="primary">
            Đóng
          </Button>
          <Button onClick={handleSaveStudent} variant="contained" color="primary">
            {"Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle><strong>Xác nhận xóa thông tin thí sinh</strong></DialogTitle>
        <DialogContent dividers>
          Bạn có chắc chắn muốn xóa thông tin thí sinh này?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">Hủy</Button>
          <Button variant="contained" onClick={handleDelete} color="secondary">Xóa</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};


export default StudentComp;