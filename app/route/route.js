import { ipcMain, BrowserWindow } from 'electron';
import Template from '../mixin/Template.js';
import Customer from '../controller/Customer.js';
import Users from '../controller/Users.js';
import Products from '../controller/Product.js';


function getWin(event) {
    return BrowserWindow.fromWebContents(event.sender);
}

// Avisa todas as janelas para recarregar
function broadcastReload(channel) {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(channel);
    }
}

//  WINDOW
ipcMain.handle('window:open', (_e, name, opts = {}) => {
    const win = Template.create(name, opts);
    Template.loadView(win, name);
});

ipcMain.handle('window:openModal', (e, name, opts = {}) => {
    const parent = getWin(e);
    if (!parent) return;
    const win = Template.create(name, {
        width: 560,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: parent,
        modal: true,
        ...opts,
    });
    Template.loadView(win, name);
});

ipcMain.handle('window:close', (e) => {
    getWin(e)?.close();
});

//  TEMP STORE — dados temporários entre janelas
let tempData = {};

ipcMain.handle('temp:set', (_e, key, data) => {
    tempData[key] = data;
});

ipcMain.handle('temp:get', (_e, key) => {
    const data = tempData[key] || null;
    delete tempData[key];
    return data;
});

//-------------------------------------------------------------------//
//  CUSTOMER
ipcMain.handle('customer:insert', async (_e, data) => {
    const result = await Customer.insert(data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:find', async (_e, where = {}) => {
    return await Customer.find(where);
});

ipcMain.handle('customer:findById', async (_e, id) => {
    return await Customer.findById(id);
});

ipcMain.handle('customer:update', async (_e, id, data) => {
    const result = await Customer.update(id, data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:delete', async (_e, id) => {
    const result = await Customer.delete(id);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

//-------------------------------------------------------------------//
//  USER
ipcMain.handle('users:insert', async (_e, data) => {
    const result = await Users.insert(data);
    if (result.status) broadcastReload('users:reload');
    return result;
});

ipcMain.handle('users:find', async (_e, where = {}) => {
    return await Users.find(where);
});

ipcMain.handle('users:findById', async (_e, id) => {
    return await Users.findById(id);
});

ipcMain.handle('users:update', async (_e, id, data) => {
    const result = await Users.update(id, data);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('users:delete', async (_e, id) => {
    const result = await Users.delete(id);
    if (result.status) broadcastReload('users:reload');
    return result;
});

//-------------------------------------------------------------------//
//  PRODUCT
ipcMain.handle('products:insert', async (_e, data) => {
    const result = await Products.insert(data);
    if (result.status) broadcastReload('products:reload');
    return result;
});

ipcMain.handle('products:find', async (_e, where = {}) => {
    return await Products.find(where);
});

ipcMain.handle('products:findById', async (_e, id) => {
    return await Products.findById(id);
});

ipcMain.handle('products:update', async (_e, id, data) => {
    const result = await Products.update(id, data);
    if (result.status) broadcastReload('products:reload');
    return result;
});

ipcMain.handle('products:delete', async (_e, id) => {
    const result = await Products.delete(id);
    if (result.status) broadcastReload('products:reload');
    return result;
});