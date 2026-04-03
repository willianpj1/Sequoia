'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    window: {
        open(name, opts) { return ipcRenderer.invoke('window:open', name, opts); },
        openModal(name, opts) { return ipcRenderer.invoke('window:openModal', name, opts); },
        close() { return ipcRenderer.invoke('window:close'); }
    },
    temp: {
        set(key, data) { return ipcRenderer.invoke('temp:set', key, data); },
        get(key) { return ipcRenderer.invoke('temp:get', key); },
    },
    customer: {
        insert(data) { return ipcRenderer.invoke('customer:insert', data); },
        find(where) { return ipcRenderer.invoke('customer:find', where); },
        findById(id) { return ipcRenderer.invoke('customer:findById', id); },
        update(id, data) { return ipcRenderer.invoke('customer:update', id, data); },
        delete(id) { return ipcRenderer.invoke('customer:delete', id); },
        onReload(callback) { ipcRenderer.on('customer:reload', () => callback()); },
    },
    users: {
        insert(data) { return ipcRenderer.invoke('users:insert', data); },
        find(where) { return ipcRenderer.invoke('users:find', where); },
        findById(id) { return ipcRenderer.invoke('users:findById', id); },
        update(id, data) { return ipcRenderer.invoke('users:update', id, data); },
        delete(id) { return ipcRenderer.invoke('users:delete', id); },
        onReload(callback) { ipcRenderer.on('users:reload', () => callback()); },
    },
    products: {
        insert(data) { return ipcRenderer.invoke('products:insert', data); },
        find(where) { return ipcRenderer.invoke('products:find', where); },
        findById(id) { return ipcRenderer.invoke('products:findById', id); },
        update(id, data) { return ipcRenderer.invoke('products:update', id, data); },
        delete(id) { return ipcRenderer.invoke('products:delete', id); },
        onReload(callback) { ipcRenderer.on('products:reload', () => callback()); },
    },
     supplier: {
        insert(data) { return ipcRenderer.invoke('supplier:insert', data); },
        find(where) { return ipcRenderer.invoke('supplier:find', where); },
        findById(id) { return ipcRenderer.invoke('supplier:findById', id); },
        update(id, data) { return ipcRenderer.invoke('supplier:update', id, data); },
        delete(id) { return ipcRenderer.invoke('supplier:delete', id); },
        count() { return ipcRenderer.invoke('supplier:count'); },
        onReload(callback) { ipcRenderer.on('supplier:reload', () => callback()); },
    },
    enterprise: {
        insert(data) { return ipcRenderer.invoke('enterprise:insert', data); },
        find(where) { return ipcRenderer.invoke('enterprise:find', where); },
        findById(id) { return ipcRenderer.invoke('enterprise:findById', id); },
        update(id, data) { return ipcRenderer.invoke('enterprise:update', id, data); },
        delete(id) { return ipcRenderer.invoke('enterprise:delete', id); },
        count() { return ipcRenderer.invoke('enterprise:count'); },
        onReload(callback) { ipcRenderer.on('enterprise:reload', () => callback()); },
    },
});