import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MusicNote as MusicNoteIcon,
  Home as HomeIcon,
  SportsEsports as GameIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Define navigation items
const navigationItems = [
  { path: "/", label: "Home", icon: <HomeIcon /> },
  { path: "/practice", label: "Practice", icon: <GameIcon /> },
  /*  { path: '/learn', label: 'Learn', icon: <LearnIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> }, */
];

export const NavBar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isCurrentPath = (path: string) => location.pathname === path;

  const navigationButtons = navigationItems.map((item) => (
    <Button
      key={item.path}
      component={Link}
      to={item.path}
      disabled={isCurrentPath(item.path)}
      variant={isCurrentPath(item.path) ? "contained" : "text"}
      startIcon={item.icon}
      sx={{
        mx: 1,
        color: isCurrentPath(item.path) ? "white" : "inherit",
        "&.Mui-disabled": {
          backgroundColor: isCurrentPath(item.path)
            ? "primary.main"
            : "transparent",
          color: isCurrentPath(item.path) ? "white" : "rgba(0, 0, 0, 0.26)",
        },
      }}
    >
      {item.label}
    </Button>
  ));

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Guitar Fretboard Trainer
      </Typography>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isCurrentPath(item.path)}
              disabled={isCurrentPath(item.path)}
              sx={{
                textAlign: "left",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isCurrentPath(item.path) ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <MusicNoteIcon
              sx={{
                display: { xs: "none", sm: "flex" },
                mr: 1,
                color: "primary.main",
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Guitar Fretboard Trainer
            </Typography>
          </Box>
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {navigationButtons}
            </Box>
          )}
          {/* Add an empty box to maintain spacing */}
          <Box sx={{ width: { xs: 0, sm: "200px" } }} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
