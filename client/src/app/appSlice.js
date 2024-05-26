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
      state.groups = addExtraDataToGroups(action.payload.groups, state.user._id);
      state.activeGroup = getActiveGroup(state.groups);
    },
    logout: (state) => {
      state.user = null;
      state.groups = [];
      state.activeGroup = null;
    },
    setActiveGroup: (state, action) => {
      state.activeGroup = getActiveGroup(state.groups, action.payload);
    },
    updateGroup: (state, action) => {
      const group = getExtraData(action.payload, state.user._id);
      const index = state.groups.findIndex(group => group._id === action.payload._id);

      if(index >= 0){
        //update group
        state.groups[index] = group;
        state.activeGroup = action.payload._id === state.activeGroup._id ? group : state.activeGroup;
      }else{ 
        //new group
        state.groups = [...state.groups, group];
        state.activeGroup = group;
        setLocalData("activeGroup", group._id);
      }
    },
    deleteGroup: (state, action) => {
      state.groups = [...state.groups].filter(group => group._id !== action.payload);
      state.activeGroup = getActiveGroup(state.groups);
    }
  }
});

export const {
  setData,
  logout,
  setActiveGroup,
  updateGroup,
  deleteGroup
} = appSlice.actions;

export default appSlice.reducer;