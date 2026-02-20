import { useRef, useState } from 'react'
import { Box, Paper, Typography, Slider } from '@mui/material'
import Editor from './components/Editor'
import type { EditorHandle } from './components/Editor'

function EditPage() {
  const editorRef = useRef<EditorHandle>(null)
  const [sleeveSize, setSleeveSize] = useState(1.0)

  const handleSleeveSizeChange = (_event: Event, newValue: number | number[]) => {
    const size = typeof newValue === 'number' ? newValue : newValue[0]
    setSleeveSize(size)
    editorRef.current?.setSleeveSize(size)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      {/* Left Sidebar */}
      <Box
        component="aside"
        sx={{
          width: '15%',
          maxWidth: '20%',
          minWidth: '200px',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            p: 2,
            borderRadius: 0,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Sleeve Size
          </Typography>
          <Slider
            value={sleeveSize}
            onChange={handleSleeveSizeChange}
            min={0.5}
            max={2.0}
            step={0.1}
            marks={[
              { value: 0.5, label: '0.5' },
              { value: 1.0, label: '1.0' },
              { value: 1.5, label: '1.5' },
              { value: 2.0, label: '2.0' },
            ]}
            valueLabelDisplay="auto"
            sx={{ mt: 2 }}
          />
        </Paper>
      </Box>

      {/* Central Container */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            p: 2,
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '500px',
            }}
          >
            <Editor ref={editorRef} />
          </Box>
        </Paper>
      </Box>

      {/* Right Sidebar */}
      <Box
        component="aside"
        sx={{
          width: '15%',
          maxWidth: '20%',
          minWidth: '200px',
          borderLeft: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: 0,
          }}
        >
          {/* Right sidebar content */}
        </Paper>
      </Box>
    </Box>
  )
}

export default EditPage

