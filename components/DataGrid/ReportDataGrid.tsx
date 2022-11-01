import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  GridRowsProp,
  DataGrid,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid';

import {datastatus} from '../../utils/SidebarData';



interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {

  return (
    <GridToolbarContainer>
      <div className='flex'>
        {datastatus.map((item:any) =>
          <span className={`super-app-theme--${item.current} p-1 m-1 border-solid border-gray border-2`} key={item.current}>{item.current}</span>)
        }
      </div>
    </GridToolbarContainer>
  );
}

const formatRows: GridRowsProp= [];

export default function ReportDataGrid(props:any) {

  const [open, setOpen] = React.useState(false);
  const[videopath, setVideopath] = React.useState("");

  const handleClickOpen = (value:string) => {
    setOpen(true);
    setVideopath(value);
  };

  const updatedata = (method:string,data:any) => {
    console.log(method, data);
    let flag = data.reportflag;
    if(method==="upgrade"){
      flag = datastatus.filter((item:any)=>item.current == flag)[0].upgrade;
    }else if(method==="cancel"){
      flag = datastatus.filter((item:any)=>item.current == flag)[0].cancel;
    }
    const changeddata = {
      _id:data._id,
      fine:data.reportfine,
      whatsapp:data.sendedwhatsapp,
      car:data.reportedcar,
      flag:flag
    }
    props.updateData(changeddata);
  } 

  const handleClose = () => {
    setOpen(false);
  };

  const [rows, setRows] = React.useState(formatRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(()=>{
    const griddata:GridRowsProp = props.data;
    setRows(griddata);
  },[props]);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // setRows(rows.filter((row) => row._id !== id));
    updatedata("cancel", rows.filter((item:any)=>item._id == id)[0]);
  };

  const handlestatusClick = (id: any) => () => {
    updatedata("upgrade", rows.filter((item:any)=>item._id == id)[0]);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    updatedata("data", updatedRow);
    // setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    return updatedRow;
  };

  const columns: GridColumns = [
    { field: '_id', headerName: '_id', width: 0, editable: false, hide: true },
    { field: 'rname', 
      headerName: '👥 Name', 
      width: 150, 
      editable: false,
      sortable: false,
      renderCell: (params:any) =>  (
        <Tooltip title={params.row.reportowner.name}>
          <span className="table-cell-trucate">{params.row.reportowner.name}</span>
        </Tooltip>
      ),
     },
    { 
      field: 'rwhatnumber', 
      headerName: 'Reporter 📱', 
      width:120,
      editable: false,
      sortable: false,
      renderCell: (params:any) =>  (
        <Tooltip title={params.row.reportowner.whatsapp}>
          <span className="table-cell-trucate">{params.row.reportowner.whatsapp}</span>
        </Tooltip>
      ),
     },
    { 
      field: 'reportnumber', 
      headerName: 'No 🔢', 
      width:80, 
      editable: false,
      sortable: false,
      renderCell: (params:any) =>  (
        <Tooltip title={`Limit: ${params.row.reportowner.reportlimit}`}>
          <span className="table-cell-trucate">{params.row.reportowner.reportnumber}</span>
        </Tooltip>
      ),
     },
    { 
      field: 'reportgps', 
      headerName: 'GPS 🌍', 
      width:100, 
      editable: false,
      sortable: false,
      renderCell: (params:any) =>  (
        <Tooltip title={params.row.reportgps} >
          <span className="table-cell-trucate">{params.row.reportgps}</span>
        </Tooltip>
       ), 
    },
    {
      field: 'reportdate',
      headerName: 'Date',
      type: 'date',
      width: 100,
      editable: false,
    },
    { field: 'reportedcar', headerName: 'Car Number', width:130, editable: true },
    { field: 'sendedwhatsapp', headerName: 'Owner 📱', sortable: false, width:120, editable: true },
    { field: 'reportfine', headerName: '💲', type:'number', width:70, editable: true },
    {
      field: 'video',
      type: 'actions',
      headerName: '🎬',
      width: 50,
      cellClassName: 'actions',
      getActions: (params:any) => {
        return [
          <GridActionsCellItem
            icon={<PlayCircleFilledWhiteOutlinedIcon />}
            label="Video View"
            className="textPrimary"
            onClick={() => handleClickOpen(params.row.reportvideo)}
            color="inherit"
          />
        ];  
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 90,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },{
      field: 'check',
      type: 'actions',
      headerName: '✅',
      width: 50,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<CheckCircleOutlineIcon />}
            label="Check"
            className="textPrimary"
            onClick={handlestatusClick(id)}
            color="inherit"
          />
        ];  
      },
    },
  ];

  return (
    <Box
        sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row: any) =>  row._id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel:any) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        getRowClassName={(params) => `super-app-theme--${params.row.reportflag}`}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 15, 25]}
        pagination
        experimentalFeatures={{ newEditingApi: true }}
      />
      <div>
        <VideoModal close={handleClose} isshow={open} path={videopath}></VideoModal>
      </div>
    </Box>
  );
}

const VideoModal = (props:any) => {

  return(
    <Dialog
    open={props.isshow}
    onClose={props.close}
    aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Reported Video"}
      </DialogTitle>
      <DialogContent>
        <video controls width="50%" style={{width:"inherit"}}>
          <source src={props.path} type="video/mp4"/>
          Sorry, your browser doesn't support videos.
        </video>
      </DialogContent>
    </Dialog>
  )
}
