import { createSlice } from "@reduxjs/toolkit";
import { getLocalData, setLocalData, deleteLocalData } from '../utils/storage.js';
import { getTotalValue } from '../utils/finance.js';

const initialState = {
  user: null,
  groups: [],
  activeGroup: null
};

function addExtraDataToGroups(groups, userId){
  return groups.map(group => getExtraData(group, userId))
}

function getExtraData(group, userId){
  return {
    ...group,
    totalIncome: getTotalValue(group.income),
    totalExpenses: getTotalValue(group.expenses),
    isAdmin: group.admins.findIndex(admin => admin._id === userId) >= 0
  }
}

function getActiveGroup(groups, groupId = ""){
  if(groups.length === 0){
    deleteLocalData('activeGroup');
    return null;
  }

  let activeGroupId = groupId;

  if(!activeGroupId){
    const data = getLocalData();
    activeGroupId = data.activeGroup || "";
  }

  const activeGroup = groups.find(group => group._id === activeGroupId) ?? groups[0];
  setLocalData('activeGroup', activeGroup._id);

  return activeGroup;
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.user = { ...action.payload, groups: null };
      
      if(action.payload.groups){
        state.groups = addExtraDataToGroups(action.payload.groups, state.user._id);
        state.activeGroup = getActiveGroup(state.groups);
      }      
    },
    setNotifications: (state, action) => {
      const index = state.groups.findIndex(group => group._id === action.payload.groupId);

      if(index < 0) return;

      state.groups[index].notifications = action.payload.data;
      state.activeGroup = state.groups[index];
    },
    logout: (state) => {
      state.user = null;
      state.groups = [];
      state.activeGroup = null;
    },
    setActiveGroup: (state, action) => {
      state.activeGroup = getActiveGroup(state.groups, action.payload);
    },
    addGroup: (state, action) => {
      const updatedGroup = getExtraData(action.payload, state.user._id);
      state.groups = [...state.groups, updatedGroup];
      state.activeGroup = updatedGroup;
      setLocalData("activeGroup", updatedGroup._id);
    },
    updateGroup: (state, action) => {
      const index = state.groups.findIndex(group => group._id === action.payload._id);

      if(index < 0) return;

      state.groups[index] = getExtraData({ ...state.groups[index], ...action.payload }, state.user._id);
      state.activeGroup = state.groups[index];
    },
    deleteGroup: (state, action) => {
      state.groups = [...state.groups].filter(group => group._id !== action.payload);
      state.activeGroup = getActiveGroup(state.groups);
    },
    addGroupItem: (state, action) => {
      const groupIndex = state.groups.findIndex(group => group._id === action.payload.groupId);
      if(groupIndex < 0) return;

      state.groups[groupIndex][action.payload.type].push(action.payload.data);

      if(['users', 'admins', 'income', 'expenses'].indexOf(action.payload.type) >= 0){
        state.groups[groupIndex] = getExtraData(state.groups[groupIndex], state.user._id);
      }

      state.activeGroup = state.groups[groupIndex];
    },
    updateGroupItem: (state, action) => {
      const groupIndex = state.groups.findIndex(group => group._id === action.payload.groupId);
      if(groupIndex < 0) return;

      const groupItemIndex = state.groups[groupIndex][action.payload.type].findIndex(item => item._id === action.payload.data._id);
      if(groupItemIndex < 0) return;

      state.groups[groupIndex][action.payload.type][groupItemIndex] = {
        ...state.groups[groupIndex][action.payload.type][groupItemIndex],
        ...action.payload.data
      };

      if(['users', 'admins', 'income', 'expenses'].indexOf(action.payload.type) >= 0){
        state.groups[groupIndex] = getExtraData(state.groups[groupIndex], state.user._id);
      }

      state.activeGroup = state.groups[groupIndex];
    },
    deleteGroupItem: (state, action) => {
      const groupIndex = state.groups.findIndex(group => group._id === action.payload.groupId);
      if(groupIndex < 0) return;

      state.groups[groupIndex][action.payload.type] = 
        state.groups[groupIndex][action.payload.type].filter(item => item._id !== action.payload.itemId);
      
      if(['users', 'admins', 'income', 'expenses'].indexOf(action.payload.type) >= 0){
        state.groups[groupIndex] = getExtraData(state.groups[groupIndex], state.user._id);
      }
  
      state.activeGroup = state.groups[groupIndex];
    }
  }
});

export const {
  setData,
  logout,
  setActiveGroup,
  setNotifications,
  addGroup,
  updateGroup,
  addGroupItem,
  updateGroupItem,
  deleteGroupItem,
  deleteGroup
} = appSlice.actions;

export default appSlice.reducer;