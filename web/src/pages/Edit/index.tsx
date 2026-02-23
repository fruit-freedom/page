import { useRef, useState } from 'react'
import { Box, Paper, Typography, Slider, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from '@mui/material'
import Editor from './components/Editor'
import type { EditorHandle } from './components/Editor'
import Sidebar from '../../shared/Sidebar'

function EditPage() {
  const editorRef = useRef<EditorHandle>(null)
  const [sleeveSize, setSleeveSize] = useState(1.0)
  const [size, setSize] = useState('M')
  const [fit, setFit] = useState('Облегченная')

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
      <Sidebar position="left">
        <Typography variant="h6" gutterBottom>
          Размер рукава
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

        <FormControl component="fieldset" sx={{ mt: 4 }}>
          <FormLabel component="legend">
            <Typography variant="h6" gutterBottom>
              Размер
            </Typography>
          </FormLabel>
          <RadioGroup
            value={size}
            onChange={(e) => setSize(e.target.value)}
            sx={{ mt: 1, display: 'flex', flexDirection: 'row' }}
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="M" control={<Radio />} label="M" />
            <FormControlLabel value="L" control={<Radio />} label="L" />
            <FormControlLabel value="XXL" control={<Radio />} label="XXL" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mt: 4 }}>
          <FormLabel component="legend">
            <Typography variant="h6" gutterBottom>
              Посадка
            </Typography>
          </FormLabel>
          <RadioGroup
            value={fit}
            onChange={(e) => setFit(e.target.value)}
            sx={{ mt: 1 }}
          >
            <FormControlLabel
              value="Облегченная"
              control={<Radio />}
              label="Облегченная"
            />
            <FormControlLabel
              value="Свободная"
              control={<Radio />}
              label="Свободная"
            />
          </RadioGroup>
        </FormControl>
      </Sidebar>

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

      {/* Right Sidebar (Currently disabled) */}
      {/* <Sidebar position="right"></Sidebar> */}
    </Box>
  )
}

export default EditPage

