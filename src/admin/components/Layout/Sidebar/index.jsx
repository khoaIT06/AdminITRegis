import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Home, Article, People, Category, AccountCircle, ExitToApp, School, Group} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '~/assests/images/logo_dthu.png';

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 260,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    drawerPaper: {
        width: 260,
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    logo: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    menuItem: {
        width: 240,
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0.5, 1),
        borderRadius: 12,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    menuIcon: {
        marginRight: theme.spacing(2),
    },
    activeMenuItem: {
        backgroundColor: '#1976d2',
        color: '#fff',
        borderRadius: 12,
        '&:hover': {
            backgroundColor: '#1976d2',
        },
    },
    logoutButtonContainer: {
        marginTop: 'auto',
        padding: theme.spacing(2),
    },
    logoutButton: {
        backgroundColor: '#f44336 !important',
        width: '100%',
        color: '#fff',
        borderRadius: 12,
    },
}));

const Sidebar = () => {
    const classes = useStyles();
    const navigate=useNavigate();
    const [activeItem, setActiveItem] = useState('/admin/articles');

    const handleItemClick = (path) => {
        setActiveItem(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login'
    };

    const handleClickLogo=()=>{
        navigate('/home');
    }

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.logo}>
                <Typography onClick={handleClickLogo}>
                    <img src={Logo} alt="Logo" style={{ width: 140, cursor: 'pointer' }} />
                </Typography>
            </div>
            
            <Divider />
            
            <List>
                <ListItem
                    component={Link}
                    to="/admin/articles"
                    className={`${classes.menuItem} ${activeItem === '/admin/articles' ? classes.activeMenuItem : ''}`}
                    onClick={() => handleItemClick('/admin/articles')}
                >
                    <Article className={classes.menuIcon} />
                    <ListItemText primary="Quản lý bài viết" />
                </ListItem>
                <ListItem
                    component={Link}
                    to="/admin/session"
                    className={`${classes.menuItem} ${activeItem === '/admin/session' ? classes.activeMenuItem : ''}`}
                    onClick={() => handleItemClick('/admin/session')}
                >
                    <School className={classes.menuIcon} />
                    <ListItemText primary="Quản lý đợt thi" />
                </ListItem>
                <ListItem
                    component={Link}
                    to="/admin/student"
                    className={`${classes.menuItem} ${activeItem === '/admin/student' ? classes.activeMenuItem : ''}`}
                    onClick={() => handleItemClick('/admin/student')}
                >
                    <Group className={classes.menuIcon} />
                    <ListItemText primary="Quản lý thí sinh" />
                </ListItem>
                <ListItem
                    component={Link}
                    to="/admin/category"
                    className={`${classes.menuItem} ${activeItem === '/admin/category' ? classes.activeMenuItem : ''}`}
                    onClick={() => handleItemClick('/admin/category')}
                >
                    <Category className={classes.menuIcon} />
                    <ListItemText primary="Quản lý danh mục" />
                </ListItem>
                <ListItem
                    component={Link}
                    to="/admin/accounts"
                    className={`${classes.menuItem} ${activeItem === '/admin/accounts' ? classes.activeMenuItem : ''}`}
                    onClick={() => handleItemClick('/admin/accounts')}
                >
                    <AccountCircle className={classes.menuIcon} />
                    <ListItemText primary="Quản lý tài khoản" />
                </ListItem>
            </List>

            <div className={classes.logoutButtonContainer}>
                <Button
                    className={classes.logoutButton}
                    variant="contained"
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                >
                    Đăng xuất
                </Button>
            </div>
        </Drawer>
    );
};

export default Sidebar;