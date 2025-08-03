// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { Sync as SyncIcon } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';

// const LandPlots = () => {
//   const [landPlots, setLandPlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);

//   const handleSync = async () => {
//     try {
//       setSyncing(true);
//       const response = await dataService.syncLandPlots();
//       setLandPlots(response.data.data);
//       toast.success(response.data.message);
//     } catch (error) {
//             toast.error('Failed to sync land plots from ERPNext');
//     } finally {
//       setSyncing(false);
//     }
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Land Plots
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<SyncIcon />}
//           onClick={handleSync}
//           disabled={syncing}
//         >
//           {syncing ? 'Syncing...' : 'Sync from ERPNext'}
//         </Button>
//       </Box>

//       {landPlots.length === 0 && !loading && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           No land plots found. Click "Sync from ERPNext" to import your land plot data from Survey doctype.
//         </Alert>
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Plot Name</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell>Area</TableCell>
//               <TableCell>Land Use Type</TableCell>
//               <TableCell>Survey Date</TableCell>
//               <TableCell>Deforestation Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {landPlots.map((plot) => (
//               <TableRow key={plot.id}>
//                 <TableCell>{plot.name}</TableCell>
//                 <TableCell>{plot.location}</TableCell>
//                 <TableCell>{plot.area} {plot.areaUnit}</TableCell>
//                 <TableCell>{plot.landUseType}</TableCell>
//                 <TableCell>{new Date(plot.surveyDate).toLocaleDateString()}</TableCell>
//                 <TableCell>{plot.deforestationStatus}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default LandPlots;




import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Menu,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { 
  Sync as SyncIcon, 
  Map as MapIcon,
  TableChart as TableIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Draw as DrawIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';
import CoordinateTable from '../components/CoordinateTable';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// Create DataContext
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [landPlots, setLandPlots] = useState(() => {
    // Load from localStorage on initialization
    const savedPlots = localStorage.getItem('landPlots');
    return savedPlots ? JSON.parse(savedPlots) : [];
  });

  useEffect(() => {
    // Save to localStorage whenever landPlots changes
    localStorage.setItem('landPlots', JSON.stringify(landPlots));
  }, [landPlots]);

  return (
    <DataContext.Provider value={{ landPlots, setLandPlots }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);

const LandPlots = () => {
  const { landPlots, setLandPlots } = useDataContext();

  // State management
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'table'
  const [uploadDialog, setUploadDialog] = useState(false);
  const [drawDialog, setDrawDialog] = useState(false);
  const [templateMenu, setTemplateMenu] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validPlots, setValidPlots] = useState([]);
  const [invalidPlots, setInvalidPlots] = useState([]);
  const [coordDialogOpen, setCoordDialogOpen] = useState(false);
  const [coordData, setCoordData] = useState([]);
  
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawnPolygon, setDrawnPolygon] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current && !map) {
      initializeMap();
    }
  }, [viewMode, mapRef.current]);

  const initializeMap = () => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet Draw CSS
    const drawLink = document.createElement('link');
    drawLink.rel = 'stylesheet';
    drawLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
    document.head.appendChild(drawLink);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Load Leaflet Draw JS
      const drawScript = document.createElement('script');
      drawScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
      drawScript.onload = () => {
        setupMap();
      };
      document.head.appendChild(drawScript);
    };
    document.head.appendChild(script);
  };

  const setupMap = () => {
    const L = window.L;

    // Initialize map
    const newMap = L.map(mapRef.current).setView([0, 0], 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add existing land plots as polygons
    landPlots.forEach(plot => {
      let coordinates;
      if (plot.geojson) {
        coordinates = JSON.parse(plot.geojson).coordinates[0]; // Parse GeoJSON
      } else if (plot.longitude && plot.latitude) {
        const d = 0.0003; // ~30 meters
        const lng = plot.longitude, lat = plot.latitude;
        coordinates = [
          [lng - d, lat - d], [lng + d, lat - d],
          [lng + d, lat + d], [lng - d, lat + d],
          [lng - d, lat - d]
        ];
      } else {
        return; // Skip invalid plot
      }

      const polygon = L.polygon(coordinates, {
        color: '#2E7D32',
        fillColor: '#4CAF50',
        fillOpacity: 0.5
      }).addTo(newMap);

      polygon.bindPopup(`
        <strong>${plot.name}</strong><br/>
        ID: ${plot.id}<br/>
        Country: ${plot.country}<br/>
        Commodities: ${plot.commodities.join(', ')}<br/>
        Area: ${plot.area} hectares
      `);
    });

    // Fit map to show all plots
    if (landPlots.length > 0) {
      const allCoords = landPlots.flatMap(p => p.geojson ? JSON.parse(p.geojson).coordinates[0] : p.coordinates);
      newMap.fitBounds(allCoords);
    }

    setMap(newMap);
  };

  const handleSync = async () => {
    try {
      const response = await dataService.syncLandPlots();
      const syncedPlots = response.data.data;

      // Merge synced plots with existing plots, avoiding duplicates
      const mergedPlots = [...landPlots];
      syncedPlots.forEach((plot) => {
        if (!mergedPlots.some((existingPlot) => existingPlot.id === plot.id)) {
          mergedPlots.push(plot);
        }
      });

      setLandPlots(mergedPlots);
      toast.success('Land plots synced from ERPNext');

      // Reinitialize drawing functionality
      if (map) {
        const L = window.L;

        // Clear existing drawn items and controls
        map.eachLayer((layer) => {
          if (layer instanceof L.FeatureGroup) {
            map.removeLayer(layer);
          }
        });

        // Re-add drawing layer and controls
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
          position: 'topright',
          draw: {
            polygon: {
              allowIntersection: false,
              drawError: {
                color: '#e1e100',
                message: '<strong>Error:</strong> Shape edges cannot cross!'
              },
              shapeOptions: {
                color: '#2E7D32'
              }
            },
            polyline: false,
            circle: false,
            rectangle: false,
            marker: false,
            circlemarker: false
          },
          edit: {
            featureGroup: drawnItems
          }
        });
        map.addControl(drawControl);

        // Reattach event listener for drawing
        map.on(L.Draw.Event.CREATED, (e) => {
          const layer = e.layer;
          drawnItems.addLayer(layer);

          // Get coordinates
          const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
          setDrawnCoordinates(coords);
          setDrawnPolygon(layer);

          // Remove draw control
          map.removeControl(drawControl);
          setIsDrawing(false);
          setDrawDialog(true);
        });
      }
    } catch (error) {
      toast.error('Failed to sync land plots');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Simulate file parsing - in real app, send to backend
      setTimeout(() => {
        setValidPlots([
          {
            id: 'UPLOAD001',
            name: 'Uploaded Plot 1',
            country: 'India',
            commodities: ['Coffee'],
            coordinates: [[78.9629, 20.5937], [78.9639, 20.5937], [78.9639, 20.5947], [78.9629, 20.5947]]
          }
        ]);
        setInvalidPlots([]);
        setUploadStep(1);
      }, 1000);
    }
  };

  const downloadTemplate = (format) => {
    // Create download based on format
    const templates = {
      excel: '/templates/land_plots_template.xlsx',
      csv: '/templates/land_plots_template.csv',
      geojson: '/templates/land_plots_template.geojson',
      kml: '/templates/land_plots_template.kml'
    };
    
    // In real app, generate and download file
    const link = document.createElement('a');
    link.href = templates[format] || templates.excel;
    link.download = `land_plots_template.${format}`;
    link.click();
    
    toast.info(`Downloading ${format.toUpperCase()} template`);
    setTemplateMenu(null);
  };

  const startDrawing = () => {
    if (!map) return;

    const L = window.L;
    setIsDrawing(true);
    setDrawnCoordinates([]);

    // Create drawing layer
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#2E7D32'
          }
        },
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    map.addControl(drawControl);

    // Handle polygon creation
    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      // Get coordinates
      const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
      setDrawnCoordinates(coords);
      setDrawnPolygon(layer);

      // Remove draw control
      map.removeControl(drawControl);
      setIsDrawing(false);
      setDrawDialog(true);
    });
  };

  const saveDrawnPlot = () => {
    const newPlot = {
      id: selectedPlot?.id || `PLOT${Date.now()}`,
      name: selectedPlot?.name || 'New Plot',
      country: selectedPlot?.country || '',
      commodities: selectedPlot?.commodities || [],
      area: calculateArea(drawnCoordinates),
      coordinates: drawnCoordinates
    };

    if (selectedPlot?.id) {
      // Update existing
      setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? newPlot : p));
      toast.success('Land plot updated');
    } else {
      // Add new
      setLandPlots([...landPlots, newPlot]);
      toast.success('Land plot created');
    }

    setDrawDialog(false);
    setSelectedPlot(null);
    setDrawnCoordinates([]);
  };

  const calculateArea = (coordinates) => {
    // Simple area calculation - in real app, use proper geodesic calculation
    return Math.round(Math.random() * 100 + 10);
  };

  const handleEdit = (plot) => {
    setSelectedPlot(plot);
    setEditDialog(true);
  };

  const handleDelete = (plotId) => {
    if (window.confirm('Are you sure you want to delete this land plot?')) {
      setLandPlots(landPlots.filter(p => p.id !== plotId));
      toast.success('Land plot deleted');
    }
  };

  const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle'];
  const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Land Plots (EUDR)
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleSync}
            sx={{ mr: 2 }}
          >
            Sync from ERPNext
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={(e) => setTemplateMenu(e.currentTarget)}
          >
            Create
          </Button>
          <Menu
            anchorEl={templateMenu}
            open={Boolean(templateMenu)}
            onClose={() => setTemplateMenu(null)}
          >
            <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
              <UploadIcon sx={{ mr: 1 }} /> Upload File
            </MenuItem>
            <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
              <DrawIcon sx={{ mr: 1 }} /> Draw on Map
            </MenuItem>
            <Divider />
            <MenuItem disabled>
              <DownloadIcon sx={{ mr: 1 }} /> Download Templates
            </MenuItem>
            <MenuItem onClick={() => downloadTemplate('excel')}>Excel Template</MenuItem>
            <MenuItem onClick={() => downloadTemplate('csv')}>CSV Template</MenuItem>
            <MenuItem onClick={() => downloadTemplate('geojson')}>GeoJSON Template</MenuItem>
            <MenuItem onClick={() => downloadTemplate('kml')}>KML Template</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* View Toggle */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)}>
          <Tab icon={<MapIcon />} label="Map View" value="map" />
          <Tab icon={<TableIcon />} label="Table View" value="table" />
        </Tabs>
      </Paper>

      {/* Map View */}
      {viewMode === 'map' && (
        <Box>
          <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            {isDrawing && (
              <Alert 
                severity="info" 
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  zIndex: 1000 
                }}
              >
                Click on the map to draw your land plot polygon
              </Alert>
            )}
          </Paper>
          
          {/* Table below map */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plot ID</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Commodities</TableCell>
                  <TableCell>Area (ha)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {landPlots.map((plot) => (
                  <TableRow key={plot.id}>
                    <TableCell>{plot.id}</TableCell>
                    <TableCell>{plot.country}</TableCell>
                    <TableCell>
                      {plot.commodities.map(c => (
                        <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{plot.area}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(plot)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(plot.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plot ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Commodities</TableCell>
                <TableCell>Area (ha)</TableCell>
                <TableCell>Coordinates</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {landPlots.map((plot) => (
                <TableRow key={plot.id}>
                  <TableCell>{plot.id}</TableCell>
                  <TableCell>{plot.name}</TableCell>
                  <TableCell>{plot.country}</TableCell>
                  <TableCell>
                    {plot.commodities.map(c => (
                      <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{plot.area}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCoordData(plot.coordinates);
                        setCoordDialogOpen(true);
                      }}
                    >
                      <GpsFixedIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(plot)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(plot.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Upload Land Plot Data</DialogTitle>
        <DialogContent>
          <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Upload File</StepLabel>
            </Step>
            <Step>
              <StepLabel>Manage Land Plots</StepLabel>
            </Step>
          </Stepper>

          {uploadStep === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Supported formats: .xlsx, .csv, .geojson, .kml, .kmz, .gpkg, .gml, .zip (shapefiles only)
              </Alert>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Browse for a file
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.csv,.geojson,.kml,.kmz,.gpkg,.gml,.zip"
                  onChange={handleFileUpload}
                />
              </Button>
              {uploadedFile && (
                <Typography sx={{ mt: 2 }}>
                  Selected: {uploadedFile.name}
                </Typography>
              )}
            </Box>
          )}

          {uploadStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Valid Plots ({validPlots.length})
              </Typography>
              <List>
                {validPlots.map((plot, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={plot.name}
                      secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>
            Cancel
          </Button>
          {uploadStep === 1 && (
            <Button 
              variant="contained" 
              onClick={() => {
                setLandPlots([...landPlots, ...validPlots]);
                setUploadDialog(false);
                setUploadStep(0);
                toast.success(`${validPlots.length} plots imported successfully`);
              }}
            >
              Import {validPlots.length} Plots
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Draw Dialog - Save drawn plot */}
      <Dialog open={drawDialog} onClose={() => setDrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Land Plot</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Plot ID"
            value={selectedPlot?.id || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Plot Name"
            value={selectedPlot?.name || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedPlot?.country || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
            >
              {countryOptions.map(country => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commodities</InputLabel>
            <Select
              multiple
              value={selectedPlot?.commodities || []}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {commodityOptions.map(commodity => (
                <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Area: ~{calculateArea(drawnCoordinates)} hectares
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrawDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveDrawnPlot}>Save Plot</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Land Plot</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Plot ID"
            value={selectedPlot?.id || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Plot Name"
            value={selectedPlot?.name || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedPlot?.country || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
            >
              {countryOptions.map(country => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commodities</InputLabel>
            <Select
              multiple
              value={selectedPlot?.commodities || []}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {commodityOptions.map(commodity => (
                <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? selectedPlot : p));
              setEditDialog(false);
              toast.success('Land plot updated');
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <CoordinateTable
        open={coordDialogOpen}
        onClose={() => setCoordDialogOpen(false)}
        coordinates={coordData}
      />

      {viewMode === 'draw' && (
        <Box sx={{ mt:2 }}>
          <Button
            variant="outlined"
            onClick={() =>
              setSelectedPlot({
                ...selectedPlot,
                coordinates: [...(selectedPlot?.coordinates || []), [0,0]]
              })
            }
          >
            + Add point
          </Button>

          {selectedPlot?.coordinates?.map((p,i)=>(
            <Box key={i} sx={{ display:'flex', gap:1, mt:1 }}>
              <TextField
                label="Latitude"
                type="number"
                value={p[1]}
                onChange={e=>{
                  const arr=[...selectedPlot.coordinates];
                  arr[i][1]=parseFloat(e.target.value);
                  setSelectedPlot({...selectedPlot, coordinates:arr});
                }}
              />
              <TextField
                label="Longitude"
                type="number"
                value={p[0]}
                onChange={e=>{
                  const arr=[...selectedPlot.coordinates];
                  arr[i][0]=parseFloat(e.target.value);
                  setSelectedPlot({...selectedPlot, coordinates:arr});
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default LandPlots;