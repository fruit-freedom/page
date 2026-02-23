import { useState, type ReactNode } from 'react'
import { Box, Paper, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

interface SidebarProps {
  children?: ReactNode
  position?: 'left' | 'right'
}

function Sidebar({ children, position = 'left' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Box
      component="aside"
      sx={{
        width: isOpen ? '15%' : '48px',
        // maxWidth: isOpen ? '20%' : '48px',
        minWidth: isOpen ? '200px' : '48px',
        transition: 'width 0.3s ease, min-width 0.3s ease, max-width 0.3s ease',
        ...(position === 'left'
          ? { borderRight: '1px solid', borderColor: 'divider' }
          : { borderLeft: '1px solid', borderColor: 'divider' }),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: isOpen ? 2 : 1,
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: position === 'left' ? 'flex-start' : 'flex-end',
            mb: isOpen ? 1 : 0,
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: 'text.primary',
            }}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        {isOpen && (
          <Box
            sx={{
              flex: 1,
            //   overflow: 'auto',
            }}
          >
            {children}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default Sidebar

