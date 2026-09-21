window.__ModuleLoader__.load({ id: 'dsh-workbuddy-hub', factory: function (require) { const module = { exports: {} };
var __wbCss = "/* src/marketplace.css */\n:root {\n  --wb-avatar-bg-accent: #a6d5da;\n  --wb-bg-active: rgba(0,0,0,.08);\n  --wb-bg-card: #ffffff;\n  --wb-bg-card-hover: #f7f7f7;\n  --wb-bg-elevated: #3c3c3c;\n  --wb-bg-hover: rgba(0,0,0,.05);\n  --wb-bg-inset-strong: #f2f2f2;\n  --wb-bg-pill-active: rgba(0,0,0,.75);\n  --wb-bg-tertiary: #f5f5f5;\n  --wb-border-card: rgba(0,0,0,.08);\n  --wb-border-card-static: #f2f2f2;\n  --wb-border-default: rgba(0,0,0,.08);\n  --wb-border-hover: rgba(0,0,0,.16);\n  --wb-border-strong: rgba(0,0,0,.16);\n  --wb-border-subtle: #f2f2f2;\n  --wb-button-primary-bg: rgba(0,0,0,.9);\n  --wb-button-primary-bg-hover: #111111;\n  --wb-button-primary-fg: #ffffff;\n  --wb-color-border-primary: rgba(0,0,0,.16);\n  --wb-color-border-secondary: #e8e8e8;\n  --wb-color-text-disabled: rgba(0,0,0,.35);\n  --wb-color-text-primary: rgba(0,0,0,.92);\n  --wb-color-text-secondary: rgba(0,0,0,.7);\n  --wb-color-text-tertiary: rgba(0,0,0,.5);\n  --wb-palette-black-100: #000000;\n  --wb-palette-gray-3: #f2f2f2;\n  --wb-palette-gray-4: #e8e8e8;\n  --wb-palette-white-100: #ffffff;\n  --wb-radius-lg: 8px;\n  --wb-radius-md: 6px;\n  --wb-radius-sm: 4px;\n  --wb-shadow-card-soft: 0 2px 10px rgba(0,0,0,.08);\n  --wb-spacing-12: 12px;\n  --wb-text-muted: rgba(0,0,0,.5);\n  --wb-text-white: #ffffff;\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.connector-panel .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.um-header__tabs {\n  display: flex;\n  align-items: center;\n  flex-wrap: nowrap;\n  gap: 4px;\n  flex-shrink: 0;\n}\n.um-tab {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  white-space: nowrap;\n  gap: 4px;\n  height: 28px;\n  padding: 0 10px;\n  border: none;\n  border-radius: var(--wb-radius-lg, 8px);\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.um-tab:hover {\n  color: var(--wb-color-text-primary);\n}\n.um-tab--active {\n  background: var(--wb-bg-pill-active);\n  color: var(--wb-text-white);\n}\n.um-tab--active svg {\n  color: var(--wb-text-white);\n}\n.um-tab--active svg path {\n  fill: var(--wb-text-white);\n}\n.um-tab--active:hover {\n  color: var(--wb-text-white);\n}\n[data-theme=dark] .um-tab--active,\n.vscode-dark .um-tab--active,\n.dark .um-tab--active {\n  background: var(--wb-button-grey-bg);\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg,\n.vscode-dark .um-tab--active svg,\n.dark .um-tab--active svg {\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg path,\n.vscode-dark .um-tab--active svg path,\n.dark .um-tab--active svg path {\n  fill: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active:hover,\n.vscode-dark .um-tab--active:hover,\n.dark .um-tab--active:hover {\n  color: var(--wb-button-grey-fg);\n}\n.ec-picker-header-right .ec-search-wrapper {\n  width: 220px;\n}\n.ec-picker-panel .ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-category-tab.is-active {\n  background: var(--wb-bg-active);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-expert-card {\n  border-color: var(--wb-color-border-secondary);\n}\n.ec-expert-card--selectable {\n  cursor: pointer;\n  transition:\n    border-color .15s,\n    box-shadow .15s,\n    background .15s;\n}\n.ec-expert-card--selectable:hover:not(.ec-expert-card--selected) {\n  border-color: var(--wb-color-border-primary);\n}\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected,\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected:hover {\n  border-color: var(--wb-button-primary-bg);\n  box-shadow: 0 0 0 1px var(--wb-button-primary-bg);\n  background: var(--wb-bg-tertiary);\n  transform: none;\n}\n.ec-expert-card--disabled {\n  opacity: .5;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.expert-center-dark .ec-category-tab:hover {\n  background: color-mix(in srgb, var(--wb-color-text-tertiary) 10%, transparent);\n  color: var(--wb-color-text-primary);\n}\n.expert-center-dark .ec-sort-btn.is-active,\n.expert-center-dark .ec-source-tab.is-active {\n  background: var(--wb-bg-elevated);\n}\n.expert-center-dark .ec-sort-btn.is-active {\n  background: var(--wb-bg-elevated);\n  box-shadow: none;\n}\n.expert-center-dark .ec-category-tab.is-active {\n  background: #242424;\n}\n.expert-center-dark .ec-expert-card {\n  border-color: transparent;\n}\n.expert-center-dark .ec-expert-card:hover,\n.expert-center-dark .ec-expert-card:focus-within {\n  border-color: transparent;\n}\n.expert-center-dark .ec-card-role,\n.expert-center-dark .ec-card-subtitle {\n  color: var(--ec-text-strong);\n}\n.expert-center-dark .ec-card-desc,\n.expert-center-dark .ec-card-usage {\n  color: var(--ec-text-desc);\n}\n.expert-center-dark .ec-expert-card:hover {\n  background: var(--wb-bg-card-hover);\n  border-color: var(--wb-border-subtle);\n}\n.expert-center-dark .ec-card-summon-btn--top:before {\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      var(--wb-bg-card));\n}\n.expert-center-dark .ec-expert-card:hover .ec-card-summon-btn--top:before,\n.expert-center-dark .ec-expert-card:focus-within .ec-card-summon-btn--top:before {\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      var(--wb-bg-card-hover));\n}\n.ec-category-tabs,\n.ec-expert-grid {\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-category-tabs::-webkit-scrollbar,\n.ec-expert-grid::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n}\n.ec-category-tabs::-webkit-scrollbar-track,\n.ec-expert-grid::-webkit-scrollbar-track {\n  background: transparent;\n  border-radius: 2px;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb,\n.ec-expert-grid::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 2px;\n  transition: background .2s ease;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb:hover,\n.ec-expert-grid::-webkit-scrollbar-thumb:hover {\n  background: var(--wb-bg-tertiary);\n}\n.ec-category-tabs::-webkit-scrollbar-corner,\n.ec-expert-grid::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.ec-category-tabs-wrap {\n  position: relative;\n  margin-bottom: 12px;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-category-tabs {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  width: 100%;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 0 0 2px;\n  cursor: grab;\n  user-select: none;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  -webkit-mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n  mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n}\n.ec-category-tabs.is-dragging,\n.ec-category-tabs.is-dragging * {\n  cursor: grabbing;\n}\n.ec-category-tabs::-webkit-scrollbar {\n  display: none;\n}\n.ec-category-tabs-next {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: var(--wb-bg-tertiary);\n  color: var(--wb-text-muted);\n  cursor: pointer;\n}\n.ec-category-tabs-next-icon {\n  width: 7px;\n  height: 7px;\n  border-top: 2px solid currentColor;\n  border-right: 2px solid currentColor;\n  transform: translate(-1px) rotate(45deg);\n}\n.ec-category-tab {\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  cursor: pointer;\n  padding: 4px 12px;\n  height: 28px;\n  border-radius: 6px;\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.ec-category-tab.is-active {\n  background: var(--wb-bg-inset-strong);\n  color: var(--wb-color-text-primary);\n  font-weight: 600;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n.ec-sort-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 24px;\n  padding: 0 8px;\n  border-radius: 4px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 22px;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-sort-btn:hover {\n  color: var(--wb-color-text-secondary);\n}\n.ec-sort-btn.is-active {\n  background: var(--wb-bg-card);\n  color: var(--wb-color-text-primary);\n}\n.ec-expert-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));\n  gap: 12px;\n  align-content: start;\n}\n.ec-expert-grid--skeleton {\n  pointer-events: none;\n}\n.ec-expert-card--skeleton {\n  cursor: default;\n  pointer-events: none;\n  opacity: 1;\n  transform: none;\n  animation: none;\n  box-shadow: 0 16px 32px -8px #00000008;\n}\n.ec-expert-card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-height: 154px;\n  padding: 16px 20px;\n  background: var(--wb-bg-card);\n  border: 1px solid var(--wb-border-card-static);\n  border-radius: 16px;\n  cursor: pointer;\n  transition:\n    box-shadow .2s ease,\n    transform .2s ease,\n    background .2s ease,\n    border-color .2s ease;\n  position: relative;\n  overflow: hidden;\n  box-shadow: var(--wb-shadow-card-soft);\n  box-sizing: border-box;\n  opacity: 0;\n  transform: translateY(4px);\n  animation-delay: var(--delay, 0s);\n  animation: fadeInUp .25s ease forwards;\n}\n.ec-expert-card:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default), var(--wb-shadow-card-soft);\n}\n.ec-expert-card:hover {\n  background: var(--wb-bg-card-hover);\n  border-color: var(--wb-border-default);\n  box-shadow: var(--wb-shadow-card-soft);\n  transform: translateY(0);\n}\n.ec-card-main {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.ec-card-main:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default);\n}\n.ec-card-head {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n}\n.ec-card-avatar-sq {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  background: var(--wb-avatar-bg-accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ec-card-avatar-sq img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-card-body {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  flex-direction: column;\n  gap: 2px;\n}\n.ec-card-title-row {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 4px;\n  min-width: 0;\n}\n.ec-card-tags {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-wrap: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-card-tag {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 20px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ec-card-subtitle {\n  color: var(--wb-color-text-primary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 16px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-role-wrap {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n}\n.ec-card-role {\n  flex: 0 1 auto;\n  min-width: 0;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n  line-height: 20px;\n  letter-spacing: 0;\n  margin-bottom: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-desc {\n  width: 100%;\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 18px;\n  display: -webkit-box;\n  line-clamp: 2;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  min-height: 36px;\n}\n.ec-card-summon-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 24px;\n  padding: 0 10px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 24px;\n  white-space: nowrap;\n  flex-shrink: 0;\n  box-shadow: none;\n  cursor: pointer;\n  transition: background .15s ease, color .15s ease;\n  outline: none;\n}\n.ec-card-summon-btn--top {\n  position: absolute;\n  top: 16px;\n  right: 20px;\n  z-index: 2;\n  opacity: 0;\n  pointer-events: none;\n  transition:\n    opacity .15s ease,\n    background .15s ease,\n    color .15s ease;\n}\n.ec-card-summon-btn--top:before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 100%;\n  width: 40px;\n  height: 100%;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      var(--wb-bg-card));\n  pointer-events: none;\n}\n.ec-expert-card:hover .ec-card-summon-btn--top:before,\n.ec-expert-card:focus-within .ec-card-summon-btn--top:before {\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      color-mix(in srgb, var(--wb-palette-black-100) 5%, var(--wb-bg-card)));\n}\n.ec-expert-card:hover .ec-card-summon-btn--top,\n.ec-expert-card:focus-within .ec-card-summon-btn--top {\n  opacity: 1;\n  pointer-events: auto;\n}\n.ec-card-summon-btn:hover {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n}\n.ec-card-summon-btn:focus,\n.ec-card-summon-btn:focus-visible,\n.ec-card-summon-btn:active {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n  box-shadow: none;\n  transform: none;\n  outline: none;\n}\n.ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-inset-strong);\n  border-color: var(--wb-border-card);\n}\n.ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.expert-center-dark .ec-search-wrapper .wb-input-wrapper,\n[data-theme=dark] .ec-search-wrapper .wb-input-wrapper,\n.vscode-dark .ec-search-wrapper .wb-input-wrapper,\n.dark .ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-tertiary);\n  border-color: var(--wb-border-card);\n}\n.expert-center-dark .ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled),\n[data-theme=dark] .ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled),\n.vscode-dark .ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled),\n.dark .ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.expert-center-dark .ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled),\n[data-theme=dark] .ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled),\n.vscode-dark .ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled),\n.dark .ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.ec-confirm-dialog-content {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.ec-confirm-dialog-checkbox-group {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.ec-confirm-dialog-checkbox {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: inherit;\n  font-size: 12px;\n  line-height: 1.5;\n  cursor: pointer;\n}\n.ec-confirm-dialog-checkbox input {\n  margin: 0;\n  accent-color: currentColor;\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  margin-left: auto;\n}\n.ec-cr-card .ec-card-title-row {\n  width: 100%;\n  box-sizing: border-box;\n  padding-right: calc(var(--wb-spacing-12) + var(--wb-spacing-8) + var(--wb-spacing-2));\n}\n.ec-cr-card .ec-card-summon-btn--top {\n  width: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  box-sizing: border-box;\n}\n.ec-cr-card .ec-card-summon-btn--top:before {\n  width: var(--wb-spacing-3);\n}\n.ec-card-grid,\n.ec-expert-grid,\n.ec-my-grid,\n.ec-official-section .ec-expert-grid {\n  grid-template-columns: repeat(3, 1fr);\n}\n:root.theme-switching .ec-expert-card,\nbody.theme-switching .ec-expert-card,\n:root.theme-switching .ec-category-tab,\nbody.theme-switching .ec-category-tab,\n:root.theme-switching .ec-sort-btn,\nbody.theme-switching .ec-sort-btn,\n:root.theme-switching .wb-button,\nbody.theme-switching .wb-button {\n  transition: none;\n}\n";
try { var __st = document.createElement('style'); __st.textContent = __wbCss; document.head.appendChild(__st); } catch (e) {}

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.jsx
var import_react2 = __toESM(require("react"), 1);

// src/MarketPage.jsx
var import_react = require("react");

// src/hub.js
var API = "/workbuddy-hub";
async function api(path, options) {
  const response = await fetch(API + path, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const e = new Error(body.error || `HTTP ${response.status}`);
    e.body = body;
    throw e;
  }
  return body;
}
var hub = {
  api,
  post: (path, payload) => api(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }),
  search: (q, kind) => api(`/search?q=${encodeURIComponent(q)}&kind=${kind}s&limit=60`).then((r) => r.hits || []),
  installed: () => api("/installed").then((r) => r.installed || {})
};

// src/MarketPage.jsx
var import_jsx_runtime = require("react/jsx-runtime");
var KINDS = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "user" },
  { id: "skill", label: "\u6280\u80FD", icon: "wand" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "link" }
];
function MarketPage({ sessionId, onNotice }) {
  const [kind, setKind] = (0, import_react.useState)("expert");
  const [query, setQuery] = (0, import_react.useState)("");
  const [hits, setHits] = (0, import_react.useState)([]);
  const [installed, setInstalled] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => {
    hub.installed().then(setInstalled).catch(() => {
    });
  }, []);
  (0, import_react.useEffect)(() => {
    let live = true;
    hub.search(query, kind).then((h) => {
      if (live) setHits(h);
    }).catch(() => {
      if (live) setHits([]);
    });
    return () => {
      live = false;
    };
  }, [kind, query]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ec-picker-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "um-header__tabs", children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        className: `um-tab${kind === k.id ? " um-tab--active" : ""}`,
        onClick: () => setKind(k.id),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k.label })
      },
      k.id
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-picker-header-right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-search-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        value: query,
        placeholder: `\u641C\u7D22${KINDS.find((k) => k.id === kind).label}`,
        onChange: (e) => setQuery(e.target.value)
      }
    ) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-category-tabs-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-category-tabs", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "ec-category-tab is-active", children: "\u5168\u90E8" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-expert-grid", children: hits.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { className: "ec-expert-card ec-expert-card--selectable", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          className: "ec-card-summon-btn ec-card-summon-btn--top",
          onClick: () => onNotice?.(`${entry.kind}/${entry.name}`),
          children: entry.kind === "expert" ? "\u53EC\u5524" : "\u8FDE\u63A5"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ec-card-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ec-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-avatar-sq", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: `/workbuddy-hub/icon?kind=${entry.kind}&name=${entry.name}`, alt: "" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "ec-card-body", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-title-row", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-role-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-role", children: entry.displayName || entry.name }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-subtitle", children: entry.kind })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-desc", children: entry.description || entry.dir }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ec-card-tags", children: (entry.tags ?? []).slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ec-card-tag", children: t }, t)) })
      ] })
    ] }, `${entry.kind}/${entry.name}`)) })
  ] });
}

// src/index.jsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var plugin = {
  async apply(ctx) {
    function HubPage(props) {
      const [notice, setNotice] = (0, import_react2.useState)("");
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ec-expert-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(MarketPage, { sessionId: props?.sessionId, onNotice: setNotice }),
        notice && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "ec-notice", children: notice })
      ] });
    }
    function PanelIcon() {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5 4.5h5.5V10H5zM13.5 4.5H19V10h-5.5zM5 13.5h5.5V19H5zM13.5 13.5H19V19h-5.5z" }) });
    }
    ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: "workbuddy-hub" }, HubPage));
    ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
      name: "sidebar.panellist",
      id: "workbuddy-hub",
      order: -90,
      label: () => "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668"
    }, PanelIcon));
  }
};
plugin.inject = ["slots", "remote.commands"];
module.exports = plugin;
return module.exports; } });
