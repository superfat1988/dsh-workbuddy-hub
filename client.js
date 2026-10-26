window.__ModuleLoader__.load({ id: 'dsh-workbuddy-hub', factory: function (require) { const module = { exports: {} };
var __wbCss = "/* src/cr-vars-light.css */\n.wbh-port {\n  --cr-avatar-fallback-bg: var(--cr-internal-avatar-fallback-bg);\n  --cr-avatar-fallback-fg: var(--cr-internal-avatar-fallback-fg);\n  --cr-badge-bg: var(--cr-internal-badge-bg);\n  --cr-badge-text: var(--cr-internal-badge-text);\n  --cr-bg-elevated: var(--cr-internal-bg-elevated);\n  --cr-bg-hover: var(--wb-bg-hover);\n  --cr-bg-input-inset: var(--cr-internal-bg-input-inset);\n  --cr-bg-primary: var(--cr-internal-bg-primary);\n  --cr-bg-secondary: var(--cr-internal-bg-secondary);\n  --cr-border-default: var(--cr-internal-border-default);\n  --cr-border-elevated: var(--cr-internal-border-elevated);\n  --cr-brand-primary: var(--cr-internal-brand-primary);\n  --cr-chip-hover-bg: var(--cr-internal-chip-hover-bg);\n  --cr-color-on-accent: var(--cr-internal-color-on-accent);\n  --cr-font-family: var(--cr-internal-font-family);\n  --cr-icon-check-selected: var(--cr-brand-primary);\n  --cr-internal-avatar-fallback-bg: #ebebeb;\n  --cr-internal-avatar-fallback-fg: #00000080;\n  --cr-internal-badge-bg: #0000000f;\n  --cr-internal-badge-text: #00000080;\n  --cr-internal-bg-elevated: #fff;\n  --cr-internal-bg-input-inset: #f7f7f7;\n  --cr-internal-bg-primary: #fff;\n  --cr-internal-bg-secondary: #f7f7f7;\n  --cr-internal-border-default: #ebebeb;\n  --cr-internal-border-elevated: #e5e5e5;\n  --cr-internal-brand-primary: #00c29a;\n  --cr-internal-chip-hover-bg: #0000000f;\n  --cr-internal-color-on-accent: #fff;\n  --cr-internal-font-family:\n    \"PingFang SC\",\n    -apple-system,\n    \"Helvetica Neue\",\n    Arial,\n    \"Microsoft Yahei\",\n    sans-serif;\n  --cr-internal-item-hover-bg: #f2f2f2;\n  --cr-internal-item-selected-bg: #f7f7f7;\n  --cr-internal-popover-bg: #fff;\n  --cr-internal-popover-border: #dedede;\n  --cr-internal-popover-divider: #f2f2f2;\n  --cr-internal-shadow-panel-light: 0 4px 16px 0 #00000014, 0 1px 4px 0 #0000000a;\n  --cr-internal-shadow-popover: 0 6px 24px 0 #0000000a, 0 4px 6px 0 #0000000a;\n  --cr-internal-status-error: #f64041;\n  --cr-internal-text-disabled: #0000004d;\n  --cr-internal-text-link: #1470b4;\n  --cr-internal-text-link-hover: #0e58a0;\n  --cr-internal-text-secondary: #000000b3;\n  --cr-internal-text-tertiary: #00000080;\n  --cr-item-hover-bg: var(--cr-internal-item-hover-bg);\n  --cr-item-selected-bg: var(--cr-internal-item-selected-bg);\n  --cr-popover-bg: var(--cr-internal-popover-bg);\n  --cr-popover-border: var(--cr-internal-popover-border);\n  --cr-popover-divider: var(--cr-internal-popover-divider);\n  --cr-scrollbar-thumb: var(--wb-scrollbar-thumb);\n  --cr-scrollbar-thumb-hover: var(--wb-scrollbar-thumb-hover);\n  --cr-shadow-panel-light: var(--cr-internal-shadow-panel-light);\n  --cr-shadow-popover: var(--cr-internal-shadow-popover);\n  --cr-status-error: var(--cr-internal-status-error);\n  --cr-text-disabled: var(--cr-internal-text-disabled);\n  --cr-text-link: var(--cr-internal-text-link);\n  --cr-text-link-hover: var(--cr-internal-text-link-hover);\n  --cr-text-primary: var(--wb-color-text-primary);\n  --cr-text-secondary: var(--cr-internal-text-secondary);\n  --cr-text-tertiary: var(--cr-internal-text-tertiary);\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 5%, transparent);\n  --wb-bg-popover: var(--wb-palette-white-100);\n  --wb-bg-primary: var(--wb-palette-white-100);\n  --wb-color-border-primary: var(--wb-palette-gray-5);\n  --wb-color-border-solid: #dedede;\n  --wb-color-text-primary: var(--wb-palette-black-100);\n  --wb-dropdown-bg-color: var(--wb-bg-popover);\n  --wb-motion-duration-fast: .15s;\n  --wb-motion-easing-decelerate: cubic-bezier(0, 0, .2, 1);\n  --wb-palette-black-100: #000;\n  --wb-palette-black-20: #0003;\n  --wb-palette-black-30: #0000004d;\n  --wb-palette-gray-2: #f7f7f7;\n  --wb-palette-gray-3: #f2f2f2;\n  --wb-palette-gray-5: #e6e6e6;\n  --wb-palette-white-100: #fff;\n  --wb-popover-border-color: var(--wb-color-border-solid);\n  --wb-popover-expand-duration-in: var(--wb-motion-duration-fast);\n  --wb-popover-expand-easing-in: var(--wb-motion-easing-decelerate);\n  --wb-popover-shadow: 0px 6px 24px 0px #0000000a, 0px 4px 6px 0px #0000000a;\n  --wb-radius-xl: 12px;\n  --wb-scrollbar-thumb: var(--wb-palette-black-20);\n  --wb-scrollbar-thumb-hover: var(--wb-palette-black-30);\n  --wb-shadow-popover: 0 4px 12px -4px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent), 0 3px 6px -8px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent);\n}\n.wbh-port {\n  --wb-text-strong: #000000e6;\n  --wb-text-medium: #000000a6;\n  --wb-text-weak: #00000080;\n  --wb-text-muted: #0000004d;\n  --wb-text-disable: #0000004d;\n  --cr-internal-text-primary: #000000e6;\n  --cr-internal-text-secondary: #000000a6;\n  --cr-internal-text-tertiary: #00000080;\n}\n\n/* src/cr-vars-dark.css */\n.wbh-port[data-ds-dark-theme],\n[data-ds-dark-theme] .wbh-port {\n  --cr-avatar-fallback-bg: var(--cr-internal-avatar-fallback-bg);\n  --cr-avatar-fallback-fg: var(--cr-internal-avatar-fallback-fg);\n  --cr-badge-bg: var(--cr-internal-badge-bg);\n  --cr-badge-text: var(--cr-internal-badge-text);\n  --cr-bg-elevated: var(--cr-internal-bg-elevated);\n  --cr-bg-hover: var(--wb-bg-hover);\n  --cr-bg-input-inset: var(--cr-internal-bg-input-inset);\n  --cr-bg-primary: var(--cr-internal-bg-primary);\n  --cr-bg-secondary: var(--cr-internal-bg-secondary);\n  --cr-border-default: var(--cr-internal-border-default);\n  --cr-border-elevated: var(--cr-internal-border-elevated);\n  --cr-brand-primary: var(--cr-internal-brand-primary);\n  --cr-chip-hover-bg: var(--cr-internal-chip-hover-bg);\n  --cr-color-on-accent: var(--cr-internal-color-on-accent);\n  --cr-font-family: var(--cr-internal-font-family);\n  --cr-icon-check-selected: var(--cr-brand-primary);\n  --cr-internal-avatar-fallback-bg: #3a3a3a;\n  --cr-internal-avatar-fallback-fg: #ffffff73;\n  --cr-internal-badge-bg: #ffffff14;\n  --cr-internal-badge-text: #ffffff80;\n  --cr-internal-bg-elevated: #242629;\n  --cr-internal-bg-input-inset: #2a2c31;\n  --cr-internal-bg-primary: #1a1b1e;\n  --cr-internal-bg-secondary: #141518;\n  --cr-internal-border-default: #2a2c31;\n  --cr-internal-border-elevated: #34373d;\n  --cr-internal-brand-primary: #3dd9b6;\n  --cr-internal-chip-hover-bg: #ffffff14;\n  --cr-internal-color-on-accent: #fff;\n  --cr-internal-font-family:\n    \"PingFang SC\",\n    -apple-system,\n    \"Helvetica Neue\",\n    Arial,\n    \"Microsoft Yahei\",\n    sans-serif;\n  --cr-internal-item-hover-bg: #ffffff14;\n  --cr-internal-item-selected-bg: #ffffff0d;\n  --cr-internal-popover-bg: #242629;\n  --cr-internal-popover-border: #34373d;\n  --cr-internal-popover-divider: #ffffff0f;\n  --cr-internal-shadow-panel-light: 0 4px 16px 0 #00000047, 0 1px 4px 0 #00000029;\n  --cr-internal-shadow-popover: 0 6px 24px 0 #0000003d, 0 4px 6px 0 #0000003d;\n  --cr-internal-status-error: #f78d8e;\n  --cr-internal-text-disabled: #ffffff40;\n  --cr-internal-text-link: #46a8f0;\n  --cr-internal-text-link-hover: #7ec5f0;\n  --cr-internal-text-secondary: #ffffffa6;\n  --cr-internal-text-tertiary: #ffffff73;\n  --cr-item-hover-bg: var(--cr-internal-item-hover-bg);\n  --cr-item-selected-bg: var(--cr-internal-item-selected-bg);\n  --cr-popover-bg: var(--cr-internal-popover-bg);\n  --cr-popover-border: var(--cr-internal-popover-border);\n  --cr-popover-divider: var(--cr-internal-popover-divider);\n  --cr-scrollbar-thumb: var(--wb-scrollbar-thumb);\n  --cr-scrollbar-thumb-hover: var(--wb-scrollbar-thumb-hover);\n  --cr-shadow-panel-light: var(--cr-internal-shadow-panel-light);\n  --cr-shadow-popover: var(--cr-internal-shadow-popover);\n  --cr-status-error: var(--cr-internal-status-error);\n  --cr-text-disabled: var(--cr-internal-text-disabled);\n  --cr-text-link: var(--cr-internal-text-link);\n  --cr-text-link-hover: var(--cr-internal-text-link-hover);\n  --cr-text-primary: var(--wb-color-text-primary);\n  --cr-text-secondary: var(--cr-internal-text-secondary);\n  --cr-text-tertiary: var(--cr-internal-text-tertiary);\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-white-100) 6%, transparent);\n  --wb-bg-overlay: var(--wb-palette-black-60);\n  --wb-bg-popover: #242424;\n  --wb-bg-primary: var(--wb-palette-gray-3);\n  --wb-color-border-primary: #262626;\n  --wb-color-border-solid: #3d3d3d;\n  --wb-color-text-primary: #fff;\n  --wb-dropdown-bg-color: var(--wb-bg-primary);\n  --wb-motion-duration-fast: .15s;\n  --wb-motion-easing-decelerate: cubic-bezier(0, 0, .2, 1);\n  --wb-palette-black-60: #0009;\n  --wb-palette-gray-2: #292929;\n  --wb-palette-gray-3: #1f1f1f;\n  --wb-palette-white-100: #fff;\n  --wb-palette-white-20: #fff3;\n  --wb-palette-white-30: #ffffff4d;\n  --wb-popover-border-color: var(--wb-color-border-solid);\n  --wb-popover-expand-duration-in: var(--wb-motion-duration-fast);\n  --wb-popover-expand-easing-in: var(--wb-motion-easing-decelerate);\n  --wb-popover-shadow: var(--shadow-md-offsetx-2,0px) 6px 24px var(--shadow-md-spread-2,-4px) #0006, var(--shadow-md-offsetx-1,0px) 4px 6px var(--shadow-md-spread-1,-8px) #0003;\n  --wb-radius-xl: 12px;\n  --wb-scrollbar-thumb: var(--wb-palette-white-20);\n  --wb-scrollbar-thumb-hover: var(--wb-palette-white-30);\n  --wb-shadow-popover: 0 4px 16px var(--wb-bg-overlay);\n}\n[data-ds-dark-theme] .wbh-port,\n.wbh-port[data-ds-dark-theme] {\n  --wb-text-strong: #ffffffe6;\n  --wb-text-medium: #ffffffa6;\n  --wb-text-weak: #ffffff80;\n  --wb-text-muted: #ffffff4d;\n  --wb-text-disable: #ffffff4d;\n  --cr-internal-text-primary: #ffffffe6;\n  --cr-internal-text-secondary: #ffffffa6;\n  --cr-internal-text-tertiary: #ffffff80;\n}\n\n/* src/cr-picker.css */\n.cr-add-menu__popover .cr-menu,\n.cr-files-submenu,\n.cr-reference-files-submenu,\n.cr-mode-submenu,\n.cr-experts-submenu,\n.cr-skills-submenu,\n.cr-connectors-submenu,\n.cr-workspace-picker-popover,\n.cr-permission-panel,\n.cr-model-selector__menu.cr-menu,\n.cr-model-selector__sub-menu,\n.cr-model-selector__group-sub-menu,\n.cr-model-selector__sub-panel,\n.cr-model-selector__name-popover.cr-popover,\n.cr-context-usage-popover,\n.cr-context-usage-requesting-tip,\n.cr-connector-chip-popover {\n  background: var(--wb-dropdown-bg-color,var(--wb-bg-primary));\n  border-color: var(--wb-color-border-primary,var(--cr-border-elevated));\n  box-shadow: var(--wb-shadow-popover,var(--cr-shadow-panel-light));\n}\n.cr-experts-submenu__search .cr-search-input,\n.cr-skills-submenu__search .cr-search-input,\n.cr-connectors-submenu__search .cr-search-input,\n.cr-workspace-picker-popover__search .cr-search-input {\n  background: var(--cb-search-input-bg,var(--wb-palette-gray-2));\n}\n.cr-im-context-menu .cr-menu-item {\n  height: 32px;\n  min-height: 32px;\n  color: var(--cr-text-primary);\n  border-radius: 8px;\n  padding: 0 8px;\n  font-size: 14px;\n  line-height: 22px;\n}\n.cr-im-context-menu .cr-menu-item:hover:not(.cr-menu-item--disabled),\n.cr-im-context-menu .cr-menu-item:focus-visible:not(.cr-menu-item--disabled),\n.cr-im-context-menu .cr-menu-item.cr-menu-item--active {\n  background-color: var(--cr-item-hover-bg);\n}\n.cr-im-context-menu .cr-menu-item__icon {\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  margin-right: 6px;\n  display: inline-flex;\n}\n.cr-im-context-menu .cr-menu-divider {\n  background: var(--cr-popover-divider);\n  height: 1px;\n  margin: 5.5px 0;\n}\n.cr-im-context-menu__danger,\n.cr-im-context-menu__danger .cr-menu-item__content {\n  color: var(--cr-status-error);\n}\n.cr-popover {\n  -webkit-app-region: no-drag;\n  border: 1px solid var(--cr-border-default);\n  background: var(--cr-bg-popover,var(--cr-bg-secondary));\n  scrollbar-width: thin;\n  scrollbar-color: var(--cr-scrollbar-thumb) transparent;\n  border-radius: 8px;\n  overflow-y: auto;\n  box-shadow: 0 4px 16px #0000001f;\n}\n.cr-popover::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n.cr-popover::-webkit-scrollbar-track {\n  background: 0 0;\n}\n.cr-popover::-webkit-scrollbar-thumb {\n  background-color: var(--cr-scrollbar-thumb);\n  border-radius: 3px;\n  transition: background-color .2s;\n}\n.cr-popover::-webkit-scrollbar-thumb:hover {\n  background-color: var(--cr-scrollbar-thumb-hover);\n}\n.cr-menu {\n  border: .5px solid var(--cr-border-default);\n  background: var(--cr-bg-elevated);\n  scrollbar-width: none;\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 120px;\n  padding: 4px;\n  display: flex;\n  box-shadow: 0 6px 24px -4px #0000001f, 0 4px 6px -8px #00000014;\n}\n.cr-menu::-webkit-scrollbar {\n  display: none;\n}\n.cr-menu-item {\n  cursor: pointer;\n  height: 32px;\n  min-height: 32px;\n  color: var(--cr-text-primary);\n  user-select: none;\n  border-radius: 6px;\n  align-items: center;\n  padding: 0 8px;\n  font-size: 13px;\n  transition: background-color .1s;\n  display: flex;\n}\n.cr-menu-item:hover:not(.cr-menu-item--disabled) {\n  background-color: var(--cr-bg-hover);\n}\n.cr-menu-item:focus-visible:not(.cr-menu-item--disabled) {\n  outline: 1px solid var(--cr-border-default);\n  outline-offset: -1px;\n  background-color: var(--cr-bg-hover);\n}\n.cr-menu-item--active {\n  background-color: var(--cr-bg-hover);\n}\n.cr-menu-item--disabled {\n  opacity: .5;\n  cursor: not-allowed;\n}\n.cr-menu-item__icon {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  margin-right: 8px;\n  display: flex;\n}\n.cr-menu-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n}\n.cr-menu-item__extra {\n  color: var(--cr-text-secondary);\n  flex-shrink: 0;\n  align-items: center;\n  margin-left: 8px;\n  font-size: 12px;\n  display: flex;\n}\n.cr-menu-divider {\n  background: var(--cr-border-default);\n  height: 1px;\n  margin: 4px 0;\n}\n.cr-menu-group {\n  flex-direction: column;\n  gap: 2px;\n  display: flex;\n}\n.cr-menu-group__title {\n  color: var(--cr-text-tertiary);\n  user-select: none;\n  padding: 4px 8px;\n  font-size: 11px;\n  line-height: 16px;\n}\n.cr-search-input {\n  flex: 0 0 32px;\n}\n.cr-scroll-to-bottom {\n  z-index: 10;\n  cursor: pointer;\n  width: 32px;\n  height: 32px;\n  color: var(--cr-text-primary);\n  background: var(--cr-bg-primary);\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  transition: box-shadow .15s;\n  animation: .16s cr-scroll-to-bottom-in;\n  display: flex;\n  position: absolute;\n  bottom: 20px;\n  left: 50%;\n  transform: translate(-50%);\n  box-shadow: 0 6px 24px #0000000a, 0 4px 6px #0000000a;\n}\n.cr-scroll-to-bottom:hover {\n  box-shadow: 0 6px 12px -4px #00000014, 0 3px 6px -8px #0000000a;\n}\n.cr-scroll-to-bottom__inner {\n  background: var(--cr-bg-primary);\n  box-sizing: border-box;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  width: 32px;\n  height: 32px;\n  display: flex;\n  overflow: hidden;\n}\n.cr-scroll-to-bottom__icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-primary);\n}\n.cr-scroll-to-bottom--loading:hover {\n  box-shadow: 0 6px 24px #0000000a, 0 4px 6px #0000000a;\n}\n.cr-scroll-to-bottom__dots {\n  color: var(--cr-text-primary);\n  justify-content: center;\n  align-items: center;\n  gap: 0;\n  display: flex;\n}\n.cr-scroll-to-bottom__dot {\n  justify-content: center;\n  align-items: center;\n  width: 6px;\n  height: 6px;\n  animation: 1.4s ease-in-out infinite both cr-scroll-to-bottom-dot;\n  display: flex;\n}\n.cr-scroll-to-bottom__dot:before {\n  content: \"\";\n  background: currentColor;\n  border-radius: 50%;\n  width: 3px;\n  height: 3px;\n}\n.cr-scroll-to-bottom__dot:nth-child(2) {\n  animation-delay: .18s;\n}\n.cr-scroll-to-bottom__dot:nth-child(3) {\n  animation-delay: .36s;\n}\n.cr-add-menu__popover .cr-menu {\n  transform-origin: 0 100%;\n  animation: cr-input-popover-expand var(--wb-popover-expand-duration-in,.2s) var(--wb-popover-expand-easing-in,cubic-bezier(.16, 1, .3, 1)) both;\n  padding: 8px;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n}\n.cr-add-menu__popover .cr-menu {\n  min-width: unset;\n  background: var(--cr-bg-elevated);\n  border-radius: 16px;\n}\n.cr-add-menu__popover .cr-menu-item {\n  border-radius: 8px;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n}\n.cr-add-menu__popover [data-submenu-open=true] > .cr-menu-item {\n  background-color: var(--cr-bg-hover);\n}\n.cr-add-menu__popover .cr-menu-divider {\n  background: var(--cr-popover-divider);\n  height: 1px;\n  margin: 6px 0;\n}\n.cr-add-menu__popover .cr-menu-item__icon {\n  color: var(--cr-text-secondary);\n}\n.cr-add-menu__popover .cr-menu-item__extra {\n  color: var(--cr-text-tertiary);\n}\n.cr-connectors-submenu {\n  background: var(--cr-bg-elevated,#242629);\n  box-sizing: border-box;\n  user-select: none;\n  border-radius: 16px;\n  flex-direction: column;\n  gap: 8px;\n  width: 240px;\n  max-width: 100%;\n  max-height: 392px;\n  padding: 8px 0;\n  display: flex;\n  overflow: hidden;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n  outline: none !important;\n}\n.cr-connectors-submenu:focus,\n.cr-connectors-submenu:focus-visible {\n  outline: none !important;\n}\n.cr-connectors-submenu__search {\n  margin: 0 8px;\n}\n.cr-connectors-submenu__list {\n  flex-direction: column;\n  flex: auto;\n  gap: 2px;\n  min-height: 0;\n  padding: 0 8px;\n  display: flex;\n  overflow-y: auto;\n}\n.cr-connectors-submenu__list::-webkit-scrollbar {\n  width: 4px;\n}\n.cr-connectors-submenu__list::-webkit-scrollbar-thumb {\n  background: 0 0;\n  border-radius: 2px;\n}\n.cr-connectors-submenu__list::-webkit-scrollbar-track {\n  background: 0 0;\n}\n.cr-connectors-submenu:hover .cr-connectors-submenu__list::-webkit-scrollbar-thumb {\n  background: var(--cr-scrollbar-thumb);\n}\n.cr-connectors-submenu__item {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  flex: 0 0 32px;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  min-height: 32px;\n  max-height: 32px;\n  padding: 0 8px;\n  line-height: 1;\n  display: flex;\n}\n.cr-connectors-submenu__item:hover {\n  background: var(--cr-item-hover-bg);\n}\n.cr-connectors-submenu__item--disabled {\n  cursor: not-allowed;\n  opacity: .6;\n}\n.cr-connectors-submenu__row-tooltip {\n  flex: none;\n}\n.cr-connectors-submenu__item-icon {\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n}\n.cr-connectors-submenu__item-icon img {\n  object-fit: cover;\n  border-radius: 3px;\n  width: 16px;\n  height: 16px;\n}\n.cr-connectors-submenu__item-icon-fallback {\n  background: var(--cr-bg-input-inset);\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary);\n  text-align: center;\n  border-radius: 3px;\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  font-family: PingFang SC, sans-serif;\n  font-size: 10px;\n  line-height: 16px;\n  display: inline-flex;\n}\n.cr-connectors-submenu__item-name {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  color: var(--cr-text-primary);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-connectors-submenu__item-tag {\n  background: var(--cr-badge-bg);\n  color: var(--cr-badge-text);\n  border-radius: 4px;\n  flex-shrink: 0;\n  padding: 0 4px;\n  font-family: PingFang SC, sans-serif;\n  font-size: 11px;\n  line-height: 16px;\n}\n.cr-connectors-submenu__highlight {\n  color: var(--cr-brand-primary);\n  font-weight: inherit;\n  background: 0 0;\n  padding: 0;\n}\n.cr-connectors-submenu__row-switch {\n  flex: 0 0 26px;\n}\n.cr-connectors-submenu__suffix-connect {\n  user-select: none;\n  flex: none;\n  align-items: center;\n  gap: 4px;\n  display: inline-flex;\n}\n.cr-connectors-submenu__suffix-connect-icon {\n  width: 14px;\n  height: 14px;\n  color: var(--cr-text-tertiary);\n  flex: 0 0 14px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connectors-submenu__item:hover .cr-connectors-submenu__suffix-connect-icon {\n  color: var(--cr-text-primary);\n}\n.cr-connectors-submenu__suffix-connect-label {\n  color: var(--cr-text-tertiary);\n  font-family: PingFang SC, sans-serif;\n  font-size: 12px;\n  line-height: 22px;\n}\n.cr-connectors-submenu__item:hover .cr-connectors-submenu__suffix-connect-label {\n  color: var(--cr-text-primary);\n}\n.cr-connectors-submenu__suffix-connecting {\n  flex: none;\n  align-items: center;\n  gap: 4px;\n  display: inline-flex;\n}\n.cr-connectors-submenu__connecting-spinner {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-brand-primary,#00c29a);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connectors-submenu__connecting-label {\n  color: var(--cr-text-primary);\n  font-family: PingFang SC, sans-serif;\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-connectors-submenu__cancel-label {\n  color: var(--cr-error,#f64041);\n  cursor: pointer;\n  font-family: PingFang SC, sans-serif;\n  font-size: 12px;\n  line-height: 20px;\n  display: none;\n}\n.cr-connectors-submenu__suffix-error-wrap {\n  flex: none;\n  align-items: center;\n  gap: 8px;\n  display: inline-flex;\n}\n.cr-connectors-submenu__error-hint-tooltip {\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connectors-submenu__error-hint {\n  color: var(--cr-error,#f64041);\n  white-space: nowrap;\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-connectors-submenu__error-action {\n  cursor: pointer;\n  display: none;\n}\n.cr-connectors-submenu__error-action:hover {\n  text-decoration: underline;\n}\n.cr-connectors-submenu .cr-connectors-submenu__item:hover .cr-connectors-submenu__error-action {\n  display: inline;\n}\n.cr-connectors-submenu .cr-connectors-submenu__item:hover .cr-connectors-submenu__error-hint:has(.cr-connectors-submenu__error-action) .cr-connectors-submenu__error-cause,\n.cr-connectors-submenu__item--connecting.cr-connectors-submenu__item--cancellable:hover .cr-connectors-submenu__connecting-spinner,\n.cr-connectors-submenu__item--connecting.cr-connectors-submenu__item--cancellable:hover .cr-connectors-submenu__connecting-label {\n  display: none;\n}\n.cr-connectors-submenu__item--connecting.cr-connectors-submenu__item--cancellable:hover .cr-connectors-submenu__cancel-label {\n  display: inline-block;\n}\n.cr-connectors-submenu__divider {\n  background: var(--cr-popover-divider);\n  flex: 0 0 1px;\n  height: 1px;\n  margin: 0 8px;\n}\n.cr-connectors-submenu__footer {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  flex: 0 0 32px;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  min-height: 32px;\n  max-height: 32px;\n  margin: 0 8px;\n  padding: 0 8px;\n  line-height: 1;\n  display: flex;\n}\n.cr-connectors-submenu__footer:hover {\n  background: var(--cr-item-hover-bg);\n}\n.cr-connectors-submenu__footer-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-primary);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connectors-submenu__footer-label {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--cr-text-primary);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-connectors-submenu__empty {\n  height: 32px;\n  color: var(--cr-text-tertiary);\n  justify-content: center;\n  align-items: center;\n  padding: 8px;\n  font-family: PingFang SC, sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  display: flex;\n}\n.cr-connectors-submenu__load-more {\n  height: 32px;\n  color: var(--cr-text-tertiary);\n  justify-content: center;\n  align-items: center;\n  font-family: PingFang SC, sans-serif;\n  font-size: 13px;\n  display: flex;\n}\n.cr-experts-submenu {\n  background: var(--cr-bg-elevated,#fff);\n  box-sizing: border-box;\n  user-select: none;\n  border-radius: 16px;\n  width: 240px;\n  max-width: 100%;\n  max-height: 100%;\n  padding: 8px;\n  overflow: auto;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n  outline: none !important;\n}\n.cr-experts-submenu:focus,\n.cr-experts-submenu:focus-visible {\n  outline: none !important;\n}\n.cr-experts-submenu--searching {\n  flex-direction: column;\n  display: flex;\n  overflow: hidden;\n}\n.cr-experts-submenu--searching .cr-experts-submenu__search,\n.cr-experts-submenu--searching .cr-experts-submenu__divider,\n.cr-experts-submenu--searching .cr-experts-submenu__summon-more {\n  flex: none;\n}\n.cr-experts-submenu--searching .cr-experts-submenu__list,\n.cr-experts-submenu--searching .cr-experts-submenu__empty {\n  flex: auto;\n  min-height: 0;\n}\n.cr-experts-submenu--searching .cr-experts-submenu__list {\n  max-height: none;\n}\n.cr-experts-submenu--searching .cr-experts-submenu__item {\n  flex-shrink: 0;\n}\n.cr-experts-submenu__search {\n  padding: 0 0 8px;\n}\n.cr-experts-submenu__list {\n  flex-direction: column;\n  gap: 2px;\n  max-height: 338px;\n  display: flex;\n  overflow-y: auto;\n}\n.cr-experts-submenu__list::-webkit-scrollbar {\n  width: 4px;\n}\n.cr-experts-submenu__list::-webkit-scrollbar-thumb {\n  background: 0 0;\n  border-radius: 2px;\n}\n.cr-experts-submenu__list::-webkit-scrollbar-track {\n  background: 0 0;\n}\n.cr-experts-submenu:hover .cr-experts-submenu__list::-webkit-scrollbar-thumb {\n  background: var(--cr-scrollbar-thumb,#00000026);\n}\n.cr-experts-submenu__item {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n}\n.cr-experts-submenu__item:hover:not(.cr-experts-submenu__item--selected) {\n  background: var(--cr-item-hover-bg,#f2f2f2);\n}\n.cr-experts-submenu__item--selected {\n  background: var(--cr-item-selected-bg,#f7f7f7);\n}\n.cr-experts-submenu__item--disabled {\n  cursor: default;\n  opacity: .6;\n}\n.cr-experts-submenu__avatar {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-color-on-accent);\n  border-radius: 6px;\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  font-family: PingFang SC, sans-serif;\n  font-size: 9px;\n  font-weight: 600;\n  line-height: 1;\n  display: inline-flex;\n  overflow: hidden;\n}\n.cr-experts-submenu__avatar img {\n  object-fit: cover;\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n.cr-experts-submenu__name {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  color: var(--cr-text-primary);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-experts-submenu__item--selected .cr-experts-submenu__name {\n  font-weight: 600;\n}\n.cr-experts-submenu__sync-state,\n.cr-experts-submenu__sync-spinner {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-experts-submenu__sync-state svg,\n.cr-experts-submenu__sync-spinner svg {\n  width: 14px;\n  height: 14px;\n}\n.cr-experts-submenu__pin-tooltip {\n  flex: 0 0 20px;\n  display: inline-flex;\n}\n.cr-experts-submenu__pin {\n  width: 20px;\n  height: 20px;\n  color: var(--cr-text-tertiary);\n  cursor: pointer;\n  opacity: 0;\n  background: 0 0;\n  border: 0;\n  border-radius: 6px;\n  flex: 0 0 20px;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  display: inline-flex;\n}\n.cr-experts-submenu__pin:hover {\n  color: var(--cr-text-primary);\n  background: 0 0;\n}\n.cr-experts-submenu__pin--active {\n  color: var(--cr-text-primary);\n  opacity: 1;\n}\n.cr-experts-submenu__item:hover .cr-experts-submenu__pin,\n.cr-experts-submenu__pin--active {\n  opacity: 1;\n}\n.cr-experts-submenu__pin-icon-rest,\n.cr-experts-submenu__pin-icon-hover {\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  display: none;\n}\n.cr-experts-submenu__item:hover .cr-experts-submenu__pin:not(.cr-experts-submenu__pin--active) .cr-experts-submenu__pin-icon-rest,\n.cr-experts-submenu__pin--active .cr-experts-submenu__pin-icon-rest {\n  display: inline-flex;\n}\n.cr-experts-submenu__item:hover .cr-experts-submenu__pin--active .cr-experts-submenu__pin-icon-rest {\n  display: none;\n}\n.cr-experts-submenu__item:hover .cr-experts-submenu__pin--active .cr-experts-submenu__pin-icon-hover {\n  display: inline-flex;\n}\n.cr-experts-submenu__check {\n  width: 14px;\n  height: 14px;\n  color: var(--cr-icon-check-selected);\n  flex: 0 0 14px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-experts-submenu__divider {\n  background: var(--cr-popover-divider);\n  height: 1px;\n  margin: 8px 0;\n}\n.cr-experts-submenu__summon-more {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n}\n.cr-experts-submenu__summon-more:hover {\n  background: var(--cr-item-hover-bg,#f2f2f2);\n}\n.cr-experts-submenu__summon-more-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-experts-submenu__summon-more-label {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--cr-text-primary);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-experts-submenu__empty {\n  height: 32px;\n  color: var(--cr-text-tertiary);\n  justify-content: center;\n  align-items: center;\n  padding: 0 8px;\n  font-family: PingFang SC, sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  display: flex;\n}\n.cr-experts-submenu__empty--retry {\n  cursor: pointer;\n}\n.cr-experts-submenu__empty--retry:hover {\n  color: var(--cr-text-secondary);\n}\n.cr-skills-submenu {\n  background: var(--cr-bg-elevated,#fff);\n  box-sizing: border-box;\n  user-select: none;\n  border-radius: 16px;\n  flex-direction: column;\n  width: 320px;\n  max-width: 100%;\n  max-height: 392px;\n  padding: 8px 0;\n  display: flex;\n  overflow: hidden;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n  outline: none !important;\n}\n.cr-skills-submenu:focus,\n.cr-skills-submenu:focus-visible {\n  outline: none !important;\n}\n.cr-skills-submenu__search {\n  margin: 0 8px;\n}\n.cr-skills-submenu__list {\n  flex-direction: column;\n  flex: auto;\n  gap: 2px;\n  min-height: 0;\n  padding: 8px 8px 0;\n  display: flex;\n  overflow-y: auto;\n}\n.cr-skills-submenu__list::-webkit-scrollbar {\n  width: 4px;\n}\n.cr-skills-submenu__list::-webkit-scrollbar-thumb {\n  background: 0 0;\n  border-radius: 2px;\n}\n.cr-skills-submenu__list::-webkit-scrollbar-track {\n  background: 0 0;\n}\n.cr-skills-submenu:hover .cr-skills-submenu__list::-webkit-scrollbar-thumb {\n  background: var(--cr-scrollbar-thumb,#00000026);\n}\n.cr-skills-submenu__item {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  align-items: flex-start;\n  gap: 8px;\n  min-height: 52px;\n  padding: 4px 8px;\n  display: flex;\n}\n.cr-skills-submenu__item:hover {\n  background: var(--cr-item-hover-bg,#f2f2f2);\n}\n.cr-skills-submenu__item--disabled {\n  cursor: default;\n}\n.cr-skills-submenu__item--busy {\n  background: var(--cr-bg-hover);\n}\n.cr-skills-submenu__item--single {\n  align-items: center;\n  min-height: 32px;\n}\n.cr-skills-submenu__item--single .cr-skills-submenu__item-icon,\n.cr-skills-submenu__item--single .cr-skills-submenu__item-avatar {\n  margin-top: 0;\n}\n.cr-skills-submenu__item-icon {\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  margin-top: 3px;\n  display: inline-flex;\n}\n.cr-skills-submenu__item-icon img {\n  object-fit: cover;\n  border-radius: 6px;\n  width: 16px;\n  height: 16px;\n}\n.cr-skills-submenu__item-avatar {\n  border-radius: 6px;\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  margin-top: 3px;\n  font-size: 9px;\n  font-weight: 600;\n  line-height: 1;\n  display: inline-flex;\n}\n.cr-skills-submenu__item-body {\n  flex-direction: column;\n  flex: auto;\n  gap: 0;\n  min-width: 0;\n  display: flex;\n}\n.cr-skills-submenu__item-title {\n  align-items: center;\n  gap: 4px;\n  display: flex;\n}\n.cr-skills-submenu__item-name {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--cr-text-primary);\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-skills-submenu__item-tag,\n.cr-skills-submenu__status-badge {\n  background: var(--cr-badge-bg);\n  color: var(--cr-badge-text);\n  border-radius: 4px;\n  flex-shrink: 0;\n  padding: 0 4px;\n  font-family: PingFang SC, sans-serif;\n  font-size: 11px;\n  line-height: 16px;\n}\n.cr-skills-submenu__status-badge {\n  align-items: center;\n  gap: 2px;\n  display: inline-flex;\n}\n.cr-skills-submenu__status-badge--busy {\n  color: var(--cr-text-secondary);\n}\n.cr-skills-submenu__status-spinner {\n  justify-content: center;\n  align-items: center;\n  width: 12px;\n  height: 12px;\n  display: inline-flex;\n}\n.cr-skills-submenu__item-desc {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.cr-skills-submenu__item-desc-text {\n  color: var(--cr-text-tertiary,#00000073);\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-skills-submenu__highlight {\n  color: var(--cr-brand-primary);\n  font-weight: inherit;\n  background: 0 0;\n  padding: 0;\n}\n.cr-skills-submenu__secondary-action {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 96px;\n  color: var(--cr-text-link);\n  cursor: pointer;\n  background: 0 0;\n  border: none;\n  border-radius: 4px;\n  flex: none;\n  align-self: center;\n  padding: 2px 4px;\n  font-size: 12px;\n  line-height: 20px;\n  overflow: hidden;\n}\n.cr-skills-submenu__secondary-action:hover:not(:disabled) {\n  color: var(--cr-text-link-hover);\n  background: var(--cr-bg-hover);\n}\n.cr-skills-submenu__secondary-action:disabled {\n  color: var(--cr-text-disabled);\n  cursor: not-allowed;\n}\n.cr-skills-submenu__secondary-action--icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-disabled,#0000004d);\n  background: 0 0;\n  border-radius: 4px;\n  justify-content: center;\n  align-items: center;\n  margin-left: 4px;\n  padding: 0;\n  display: inline-flex;\n  position: relative;\n}\n.cr-skills-submenu__secondary-action--icon:hover:not(:disabled) {\n  color: var(--cr-text-primary,#000000e6);\n  background: 0 0;\n}\n.cr-skills-submenu__secondary-action--icon:disabled {\n  color: var(--cr-text-disabled);\n  cursor: not-allowed;\n}\n.cr-skills-submenu__secondary-action--icon > svg {\n  width: 16px;\n  height: 16px;\n}\n.cr-skills-submenu__secondary-action-dot {\n  border: 1px solid var(--cr-bg-elevated,#fff);\n  box-sizing: border-box;\n  background: #f80;\n  border-radius: 50%;\n  width: 6px;\n  height: 6px;\n  position: absolute;\n  top: -1px;\n  right: -1px;\n}\n.cr-skills-submenu__cloud-badge {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-tertiary,#00000073);\n  flex: none;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-skills-submenu__cloud-badge > svg {\n  width: 16px;\n  height: 16px;\n}\n.cr-skills-submenu__hover-hint {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-disabled,#0000004d);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-self: center;\n  align-items: center;\n  margin-left: 4px;\n  display: none;\n}\n.cr-skills-submenu__item:hover .cr-skills-submenu__hover-hint {\n  display: inline-flex;\n}\n.cr-skills-submenu__hover-hint > svg {\n  width: 16px;\n  height: 16px;\n}\n.cr-skills-submenu__pin-btn {\n  cursor: pointer;\n  width: 16px;\n  color: var(--cr-text-disabled,#0000004d);\n  background: 0 0;\n  border: none;\n  border-radius: 4px;\n  flex: 0 0 16px;\n  justify-content: center;\n  align-self: stretch;\n  align-items: center;\n  margin-left: 4px;\n  padding: 0;\n  transition: color .15s, background .15s;\n  display: none;\n}\n.cr-skills-submenu__item:hover .cr-skills-submenu__pin-btn:not(.cr-skills-submenu__pin-btn--pinned),\n.cr-skills-submenu__item:hover .cr-skills-submenu__pin-btn:not(.cr-skills-submenu__pin-btn--pinned) .cr-skills-submenu__pin-icon-rest {\n  display: inline-flex;\n}\n.cr-skills-submenu__pin-btn--pinned {\n  color: var(--cr-text-primary,#000000e6);\n  display: inline-flex;\n}\n.cr-skills-submenu__pin-btn--pinned .cr-skills-submenu__pin-icon-rest {\n  display: inline-flex;\n}\n.cr-skills-submenu__item:hover .cr-skills-submenu__pin-btn--pinned .cr-skills-submenu__pin-icon-rest {\n  display: none;\n}\n.cr-skills-submenu__item:hover .cr-skills-submenu__pin-btn--pinned .cr-skills-submenu__pin-icon-hover {\n  display: inline-flex;\n}\n.cr-skills-submenu__pin-btn:hover {\n  color: var(--cr-text-primary,#000000e6);\n  background: 0 0;\n}\n.cr-skills-submenu__pin-icon-rest,\n.cr-skills-submenu__pin-icon-hover {\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  display: none;\n}\n.cr-skills-submenu__divider {\n  background: var(--cr-popover-divider);\n  flex: 0 0 1px;\n  height: 1px;\n  margin: 8px 8px 0;\n}\n.cr-skills-submenu__actions {\n  flex-direction: column;\n  gap: 2px;\n  padding: 8px 8px 0;\n  display: flex;\n}\n.cr-skills-submenu__action-row {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n}\n.cr-skills-submenu__action-row:hover {\n  background: var(--cr-item-hover-bg,#f2f2f2);\n}\n.cr-skills-submenu__action-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-skills-submenu__action-label {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--cr-text-primary);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-skills-submenu__empty {\n  min-height: 52px;\n  color: var(--cr-text-tertiary);\n  justify-content: center;\n  align-items: center;\n  padding: 8px;\n  font-family: PingFang SC, sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  display: flex;\n}\n.cr-model-selector__popover.cr-popover {\n  box-shadow: none;\n  background: 0 0;\n  border: none;\n  border-radius: 0;\n  flex-direction: column;\n  display: flex;\n  overflow: visible;\n}\n.cr-model-selector__menu.cr-menu {\n  transform-origin: 100% 100%;\n  animation: cr-input-popover-expand var(--wb-popover-expand-duration-in,.2s) var(--wb-popover-expand-easing-in,cubic-bezier(.16, 1, .3, 1)) both;\n}\n.cr-model-selector__menu.cr-menu {\n  box-sizing: border-box;\n  border: .5px solid var(--cr-popover-border);\n  width: 340px;\n  min-height: 0;\n  box-shadow: var(--cr-shadow-popover);\n  background: var(--cr-bg-elevated);\n  border-radius: 16px;\n  flex: auto;\n  gap: 0;\n  padding: 8px;\n  overflow: hidden;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n}\n.cr-model-selector__menu > .cr-menu-item {\n  border-radius: 8px;\n  flex-shrink: 0;\n  height: 32px;\n  margin: 0;\n  padding: 0 8px;\n  font-size: 14px;\n  line-height: 22px;\n}\n.cr-model-selector__menu .cr-menu-divider {\n  background: var(--cr-popover-divider);\n  flex-shrink: 0;\n  height: 1px;\n  margin: 4px 0;\n}\n.cr-connector-chip {\n  padding: 0 8px;\n}\n.cr-connector-chip:hover,\n.cr-connector-chip[aria-expanded=true] {\n  background: var(--cr-chip-hover-bg);\n}\n.cr-connector-chip--multi {\n  padding: 0 8px;\n}\n.cr-connector-chip--multi .cr-connector-chip__logo {\n  box-shadow: 0 0 0 2px var(--cr-bg-elevated,#fff);\n}\n.cr-connector-chip__logo-stack {\n  flex-shrink: 0;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connector-chip__logo {\n  background: #fff;\n  border-radius: 50%;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  position: relative;\n  overflow: hidden;\n}\n.cr-connector-chip__logo + .cr-connector-chip__logo {\n  margin-left: -4px;\n}\n.cr-connector-chip__logo img {\n  object-fit: cover;\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n.cr-connector-chip__logo--fallback {\n  background: var(--cr-avatar-fallback-bg);\n  color: var(--cr-avatar-fallback-fg);\n  text-transform: uppercase;\n  font-size: 9px;\n  font-weight: 600;\n}\n.cr-connector-chip-popover {\n  border-radius: 16px;\n  flex-direction: column;\n  min-width: 240px;\n  max-height: 392px;\n  padding: 0;\n  display: flex;\n  overflow: hidden;\n  background: var(--wb-bg-popover,var(--cr-popover-bg)) !important;\n  border: .5px solid var(--wb-popover-border-color,var(--cr-border-elevated)) !important;\n  box-shadow: var(--wb-popover-shadow,var(--cr-shadow-panel-light)) !important;\n}\n.cr-connector-chip-popover__surface {\n  transform-origin: 16px bottom;\n  animation: cr-input-popover-expand var(--wb-popover-expand-duration-in,.2s) var(--wb-popover-expand-easing-in,cubic-bezier(.16, 1, .3, 1)) both;\n}\n.cr-connector-chip-popover__surface {\n  width: 100%;\n  min-height: 0;\n  max-height: inherit;\n  border-radius: inherit;\n  background: inherit;\n  box-sizing: border-box;\n  flex-direction: column;\n  flex: auto;\n  padding: 8px 0;\n  display: flex;\n  overflow: hidden;\n}\n.cr-connector-chip-popover__empty {\n  text-align: center;\n  color: var(--cr-text-tertiary,#00000059);\n  padding: 16px;\n  font-size: 13px;\n}\n.cr-connector-chip-popover__list {\n  flex-direction: column;\n  flex: auto;\n  gap: 2px;\n  min-height: 0;\n  padding: 0 8px;\n  display: flex;\n  overflow-y: auto;\n}\n.cr-connector-chip-popover__list::-webkit-scrollbar {\n  width: 4px;\n}\n.cr-connector-chip-popover__list::-webkit-scrollbar-thumb {\n  background: var(--cr-scrollbar-thumb);\n  border-radius: 2px;\n}\n.cr-connector-chip-popover__list::-webkit-scrollbar-track {\n  background: 0 0;\n}\n.cr-connector-chip-popover__row-tooltip {\n  flex: none;\n}\n.cr-connector-chip-popover__row {\n  cursor: pointer;\n  border-radius: 8px;\n  flex-shrink: 0;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n}\n.cr-connector-chip-popover__row:hover {\n  background: var(--cr-item-hover-bg);\n}\n.cr-connector-chip-popover__row--disabled {\n  cursor: not-allowed;\n  opacity: .6;\n}\n.cr-connector-chip-popover__row-icon {\n  border-radius: 50%;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  overflow: hidden;\n}\n.cr-connector-chip-popover__row-icon img {\n  object-fit: cover;\n  width: 100%;\n  height: 100%;\n  display: block;\n}\n.cr-connector-chip-popover__row-fallback {\n  background: var(--cr-avatar-fallback-bg);\n  width: 100%;\n  height: 100%;\n  color: var(--cr-avatar-fallback-fg);\n  text-transform: uppercase;\n  justify-content: center;\n  align-items: center;\n  font-size: 9px;\n  font-weight: 600;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__row-name {\n  min-width: 0;\n  color: var(--cr-text-primary,#000000e6);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  flex: 1;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-connector-chip-popover__suffix-connect {\n  color: var(--cr-text-tertiary,#00000059);\n  flex: none;\n  align-items: center;\n  gap: 4px;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__suffix-connect-icon {\n  flex: 0 0 14px;\n  justify-content: center;\n  align-items: center;\n  width: 14px;\n  height: 14px;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__suffix-connect-label {\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-connector-chip-popover__row:hover .cr-connector-chip-popover__suffix-connect {\n  color: var(--cr-text-primary,#000000e6);\n}\n.cr-connector-chip-popover__suffix-connecting {\n  flex: none;\n  align-items: center;\n  gap: 4px;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__connecting-spinner {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-brand-primary,#00c29a);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__connecting-label {\n  color: var(--cr-text-primary,#000000e6);\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-connector-chip-popover__suffix-error-wrap {\n  flex: none;\n  align-items: center;\n  gap: 8px;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__error-hint-tooltip {\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__error-hint {\n  color: var(--cr-error,#f64041);\n  white-space: nowrap;\n  font-size: 12px;\n  line-height: 20px;\n}\n.cr-connector-chip-popover__error-action {\n  cursor: pointer;\n  display: none;\n}\n.cr-connector-chip-popover__error-action:hover {\n  text-decoration: underline;\n}\n.cr-connector-chip-popover__row:hover .cr-connector-chip-popover__error-action {\n  display: inline;\n}\n.cr-connector-chip-popover__row:hover .cr-connector-chip-popover__error-hint:has(.cr-connector-chip-popover__error-action) .cr-connector-chip-popover__error-cause {\n  display: none;\n}\n.cr-connector-chip-popover__cancel-label {\n  color: var(--cr-error,#f64041);\n  cursor: pointer;\n  font-size: 12px;\n  line-height: 20px;\n  display: none;\n}\n.cr-connector-chip-popover__row--connecting.cr-connector-chip-popover__row--cancellable:hover .cr-connector-chip-popover__connecting-spinner,\n.cr-connector-chip-popover__row--connecting.cr-connector-chip-popover__row--cancellable:hover .cr-connector-chip-popover__connecting-label {\n  display: none;\n}\n.cr-connector-chip-popover__row--connecting.cr-connector-chip-popover__row--cancellable:hover .cr-connector-chip-popover__cancel-label {\n  display: inline-block;\n}\n.cr-connector-chip-popover__row-switch-wrap {\n  cursor: inherit;\n  flex-shrink: 0;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__row-switch {\n  flex-shrink: 0;\n}\n.cr-connector-chip-popover__divider {\n  background: var(--cr-popover-divider);\n  flex: 0 0 1px;\n  height: 1px;\n  margin: 8px 8px 0;\n}\n.cr-connector-chip-popover__footer {\n  flex-direction: column;\n  flex: none;\n  gap: 2px;\n  padding: 8px 8px 0;\n  display: flex;\n}\n.cr-connector-chip-popover__footer-item {\n  cursor: pointer;\n  box-sizing: border-box;\n  border-radius: 8px;\n  flex-shrink: 0;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n}\n.cr-connector-chip-popover__footer-item:hover {\n  background: var(--cr-item-hover-bg);\n}\n.cr-connector-chip-popover__footer-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary,#00000080);\n  flex: 0 0 16px;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.cr-connector-chip-popover__footer-label {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--cr-text-primary,#000000e6);\n  flex: auto;\n  font-family:\n    PingFang SC,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-trigger-search-panel__pin-btn {\n  cursor: pointer;\n  width: 28px;\n  height: 28px;\n  color: var(--cr-text-disabled,#0000004d);\n  background: 0 0;\n  border: none;\n  border-radius: 6px;\n  flex: 0 0 28px;\n  justify-content: center;\n  align-items: center;\n  margin: -4px -6px -4px 4px;\n  padding: 0;\n  transition: color .15s, background .15s;\n  display: none;\n}\n.cr-trigger-search-panel__item:hover .cr-trigger-search-panel__pin-btn,\n.cr-trigger-search-panel__item--selected .cr-trigger-search-panel__pin-btn {\n  display: inline-flex;\n}\n.cr-trigger-search-panel__pin-btn--pinned {\n  color: var(--cr-text-primary,#000000e6);\n  display: inline-flex;\n}\n.cr-trigger-search-panel__pin-btn .cr-trigger-search-panel__pin-icon-rest {\n  display: inline-flex;\n}\n.cr-trigger-search-panel__pin-btn .cr-trigger-search-panel__pin-icon-hover,\n.cr-trigger-search-panel__item:hover .cr-trigger-search-panel__pin-btn--pinned .cr-trigger-search-panel__pin-icon-rest,\n.cr-trigger-search-panel__item--selected .cr-trigger-search-panel__pin-btn--pinned .cr-trigger-search-panel__pin-icon-rest {\n  display: none;\n}\n.cr-trigger-search-panel__item:hover .cr-trigger-search-panel__pin-btn--pinned .cr-trigger-search-panel__pin-icon-hover,\n.cr-trigger-search-panel__item--selected .cr-trigger-search-panel__pin-btn--pinned .cr-trigger-search-panel__pin-icon-hover {\n  display: inline-flex;\n}\n.cr-trigger-search-panel__pin-btn:hover {\n  color: var(--cr-text-primary,#000000e6);\n}\n.cr-trigger-search-panel__pin-icon-rest,\n.cr-trigger-search-panel__pin-icon-hover {\n  justify-content: center;\n  align-items: center;\n  width: 16px;\n  height: 16px;\n}\n.cr-trigger-search-panel__pin-icon-rest > svg,\n.cr-trigger-search-panel__pin-icon-hover > svg {\n  width: 16px;\n  height: 16px;\n}\n.cr-trigger-search-panel {\n  overscroll-behavior: none;\n  border: 1px solid var(--cr-border-default,#dedede);\n  background: var(--cr-bg-elevated,#fff);\n  box-shadow: var(--cr-shadow-popover);\n  z-index: 1;\n  box-sizing: border-box;\n  border-bottom: none;\n  border-radius: 24px 24px 0 0;\n  flex-direction: column;\n  padding-top: 8px;\n  display: flex;\n  overflow: hidden;\n}\n.cr-trigger-search-panel__scroll {\n  overscroll-behavior: none;\n  flex-direction: column;\n  flex: auto;\n  min-height: 0;\n  padding: 0 8px 40px;\n  display: flex;\n  position: static;\n  overflow-y: auto;\n}\n.cr-trigger-search-panel__scroll::-webkit-scrollbar {\n  width: 6px;\n}\n.cr-trigger-search-panel__scroll::-webkit-scrollbar-track {\n  background: 0 0;\n  margin-top: 28px;\n  margin-bottom: 40px;\n}\n.cr-trigger-search-panel__scroll::-webkit-scrollbar-thumb {\n  background-color: var(--cr-scrollbar-thumb,#ebebeb);\n  background-clip: padding-box;\n  border-right: 2px solid #0000;\n  border-radius: 3px;\n}\n.cr-trigger-search-panel__empty,\n.cr-trigger-search-panel__loading {\n  text-align: center;\n  color: var(--cr-text-tertiary,#0000004d);\n  padding: 12px 16px;\n  font-size: 14px;\n  line-height: 22px;\n}\n.cr-trigger-search-panel__group {\n  background: var(--cr-bg-elevated,#fff);\n  flex-direction: column;\n  gap: 2px;\n  display: flex;\n}\n.cr-trigger-search-panel__group-title {\n  z-index: 2;\n  box-sizing: border-box;\n  height: 28px;\n  color: var(--cr-text-tertiary);\n  background: var(--cr-bg-elevated,#fff);\n  user-select: none;\n  cursor: default;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 8px;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 20px;\n  display: flex;\n  position: sticky;\n  top: 0;\n}\n.cr-trigger-search-panel__group:first-of-type:not(:last-of-type) {\n  border-bottom: 1px solid var(--cr-popover-divider);\n  margin-bottom: 8px;\n}\n.cr-trigger-search-panel__group-title-label,\n.cr-trigger-search-panel__group-title-count {\n  font-weight: inherit;\n}\n.cr-trigger-search-panel__group:not(:first-of-type) > .cr-trigger-search-panel__group-title {\n  height: 32px;\n  padding: 6px 8px;\n  top: 28px;\n}\n.cr-trigger-search-panel__accordion-top,\n.cr-trigger-search-panel__accordion-bottom {\n  height: 28px;\n  color: var(--cr-text-tertiary);\n  background: var(--cr-bg-elevated,#fff);\n  z-index: 3;\n  cursor: default;\n  user-select: none;\n  pointer-events: auto;\n  box-sizing: border-box;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 8px;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 20px;\n  display: flex;\n  position: absolute;\n  left: 16px;\n  right: 8px;\n}\n.cr-trigger-search-panel__accordion-top {\n  border-bottom: 1px solid var(--cr-popover-divider);\n  top: 8px;\n}\n.cr-trigger-search-panel__accordion-bottom {\n  border-top: 1px solid var(--cr-popover-divider);\n  height: 32px;\n  padding: 6px 8px;\n  bottom: 32px;\n}\n.cr-trigger-search-panel__item {\n  cursor: pointer;\n  user-select: none;\n  height: 32px;\n  color: var(--cr-text-primary,#000000e6);\n  border-radius: 8px;\n  align-items: center;\n  gap: 8px;\n  padding: 0 8px;\n  font-size: 14px;\n  line-height: 22px;\n  transition: background .1s;\n  display: flex;\n}\n.cr-trigger-search-panel__item:hover,\n.cr-trigger-search-panel__item--selected {\n  background: var(--cr-bg-hover,#f2f2f2);\n}\n.cr-trigger-search-panel__item--disabled {\n  opacity: .5;\n  cursor: not-allowed;\n}\n.cr-trigger-search-panel__item-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--cr-text-secondary,#0009);\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  font-size: 14px;\n  display: flex;\n}\n.cr-trigger-search-panel__item-icon > img,\n.cr-trigger-search-panel__item-icon > svg {\n  width: 100%;\n  height: 100%;\n}\n.cr-trigger-search-panel__item-content {\n  flex: 1;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  display: flex;\n  overflow: hidden;\n}\n.cr-trigger-search-panel__item-label {\n  white-space: nowrap;\n  color: var(--cr-text-primary);\n  flex-shrink: 0;\n  align-items: center;\n  gap: 6px;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n  display: inline-flex;\n}\n.cr-trigger-search-panel__item-label mark {\n  color: var(--cr-brand-primary,#00b96b);\n  font-weight: inherit;\n  background: 0 0;\n}\n.cr-trigger-search-panel__item-desc {\n  min-width: 0;\n  color: var(--cr-text-secondary,#0009);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  flex: 1;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 22px;\n  overflow: hidden;\n}\n.cr-trigger-search-panel__item-desc mark {\n  color: var(--cr-brand-primary,#00b96b);\n  font-weight: inherit;\n  background: 0 0;\n}\n.cr-trigger-search-panel__item-right {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  margin-left: auto;\n  display: inline-flex;\n}\n.cr-trigger-search-panel--detached {\n  border: 1px solid var(--cr-border-default,#ebebeb);\n  background: var(--cr-bg-elevated,#fff);\n  border-radius: 16px;\n  padding: 8px;\n  box-shadow: 0 4px 6px -8px #0000000a, 0 6px 24px -4px #0000000a;\n}\n.cr-trigger-search-panel--detached:not(.cr-trigger-search-panel--compact) .cr-trigger-search-panel__scroll {\n  padding-bottom: 0;\n}\n.cr-trigger-search-panel--detached .cr-trigger-search-panel__scroll::-webkit-scrollbar-track {\n  margin-bottom: 0;\n}\n.cr-trigger-search-panel--detached .cr-trigger-search-panel__accordion-top,\n.cr-trigger-search-panel--detached .cr-trigger-search-panel__accordion-bottom {\n  z-index: 10;\n  background: var(--cr-bg-elevated,#fff);\n}\n.cr-trigger-search-panel--detached .cr-trigger-search-panel__accordion-bottom {\n  bottom: 8px;\n}\n.cr-trigger-search-panel--below {\n  border-bottom: 1px solid var(--cr-border-default,#ebebeb);\n  border-radius: 16px;\n}\n.cr-trigger-search-panel--compact .cr-trigger-search-panel__scroll {\n  padding: 0;\n}\n.im-conversation-input .cr-add-menu,\n.im-conversation-input .cr-connector-chip {\n  display: none;\n}\n.im-mention-panel.cr-trigger-search-panel {\n  font-family: var(--cr-font-family);\n  border-width: .5px;\n  border-radius: 16px 16px 0 0;\n  padding: 12px 0 0;\n}\n.im-mention-panel.cr-trigger-search-panel.cr-trigger-search-panel--below {\n  border-radius: 16px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__scroll {\n  padding: 0 12px 44px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__scroll::-webkit-scrollbar {\n  width: 4px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__scroll::-webkit-scrollbar-track {\n  margin-top: 0;\n  margin-bottom: 44px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__scroll::-webkit-scrollbar-thumb {\n  border-right: none;\n  border-radius: 12px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__group {\n  gap: 2px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__item {\n  box-sizing: border-box;\n  border-radius: 8px;\n  gap: 6px;\n  height: 32px;\n  padding: 4px 8px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__item:hover,\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__item--selected {\n  background: var(--cr-bg-hover);\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__item-icon {\n  width: 20px;\n  height: 20px;\n}\n.im-mention-panel.cr-trigger-search-panel .im-mention-panel__avatar.wb-avatar {\n  box-sizing: border-box;\n  box-shadow: none;\n  background: 0 0;\n  border: 0;\n  border-radius: 20%;\n  position: relative;\n  overflow: hidden;\n}\n.im-mention-panel.cr-trigger-search-panel .im-mention-panel__avatar.wb-avatar:after {\n  content: \"\";\n  z-index: 1;\n  border-radius: inherit;\n  box-shadow: inset 0 0 0 .5px var(--wb-color-border-primary,#e6e6e6);\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n}\n.im-mention-panel.cr-trigger-search-panel.cr-trigger-search-panel--detached .cr-trigger-search-panel__scroll {\n  padding: 0 12px 12px;\n}\n.im-mention-panel.cr-trigger-search-panel.cr-trigger-search-panel--detached .cr-trigger-search-panel__scroll::-webkit-scrollbar-track {\n  margin-bottom: 12px;\n}\n.im-mention-panel.cr-trigger-search-panel .cr-trigger-search-panel__item-label {\n  color: var(--cr-text-primary);\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n}\n.cr-popover.im-emoji-popover {\n  border-radius: var(--wb-radius-xl);\n  box-shadow: none;\n  background: 0 0;\n  border: 0;\n  overflow: visible;\n}\n.cr-popover.im-emoji-popover > .im-emoji-panel {\n  max-height: inherit;\n}\n.stp-left .cr-scroll-to-bottom,\n.stp-left [class*=chatMessageBottomToolbarWrapper] {\n  display: none !important;\n}\n@media (prefers-reduced-motion: reduce) {\n  .cr-scroll-to-bottom {\n    animation: none;\n  }\n  .cr-scroll-to-bottom__dot {\n    opacity: .9;\n    animation: none;\n  }\n  .cr-add-menu__popover .cr-menu {\n    animation-duration: 1ms;\n  }\n  .cr-model-selector__menu.cr-menu {\n    animation-duration: 1ms;\n  }\n  .cr-connector-chip-popover__surface {\n    animation-duration: 1ms;\n  }\n}\n\n/* src/cr-search-input.patch.css */\n.wbh-port .cr-search-input {\n  box-sizing: border-box;\n  width: 100%;\n  height: 32px;\n  padding: 0 8px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-palette-gray-2, #f7f7f7);\n  color: var(--cr-text-primary, #1a1a1a);\n  font-family:\n    \"PingFang SC\",\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    sans-serif;\n  font-size: 14px;\n  line-height: 22px;\n  outline: none;\n}\n.wbh-port .cr-search-input::placeholder {\n  color: var(--cr-text-tertiary, #8c8c8c);\n}\n.wbh-port .cr-search-input:hover {\n  background: var(--wb-palette-gray-3, #f0f0f0);\n}\n.wbh-port .cr-search-input:focus {\n  background: var(--wb-palette-gray-2, #f7f7f7);\n  box-shadow: inset 0 0 0 1px var(--cr-border-focus, #1f7ae0);\n}\n[data-ds-dark-theme] .wbh-port .cr-search-input {\n  background: var(--wb-palette-gray-2, #2a2a2a);\n  color: var(--cr-text-primary, #e8e8e8);\n}\n[data-ds-dark-theme] .wbh-port .cr-search-input:hover {\n  background: var(--wb-palette-gray-3, #333);\n}\n[data-ds-dark-theme] .wbh-port .cr-search-input::placeholder {\n  color: var(--cr-text-tertiary, #8a8a8a);\n}\n.wbh-port.wbh-flyout.cr-experts-submenu {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 8px;\n  border-radius: 16px;\n  background: var(--wb-bg-popover, var(--cr-popover-bg, #fff));\n  border: .5px solid var(--wb-popover-border-color, transparent);\n}\n.wbh-port.wbh-flyout.cr-skills-submenu {\n  box-sizing: border-box;\n  width: 320px;\n  padding: 8px 0;\n  border-radius: 16px;\n  background: var(--wb-bg-popover, var(--cr-popover-bg, #fff));\n  border: .5px solid var(--wb-popover-border-color, transparent);\n}\n.wbh-port.wbh-flyout.cr-connectors-submenu {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 8px 0;\n  gap: 8px;\n  border-radius: 16px;\n  background: var(--wb-bg-popover, var(--cr-popover-bg, #fff));\n  border: .5px solid var(--wb-popover-border-color, transparent);\n}\n.wbh-port .cr-experts-submenu__list::-webkit-scrollbar,\n.wbh-port .cr-skills-submenu__list::-webkit-scrollbar,\n.wbh-port .cr-connectors-submenu__list::-webkit-scrollbar {\n  width: 4px;\n}\n.wbh-port .cr-experts-submenu__list::-webkit-scrollbar-thumb,\n.wbh-port .cr-skills-submenu__list::-webkit-scrollbar-thumb,\n.wbh-port .cr-connectors-submenu__list::-webkit-scrollbar-thumb {\n  background: var(--cr-scrollbar-thumb, #c1c1c1);\n  border-radius: 2px;\n}\n.wbh-port .cr-connectors-submenu__row-switch {\n  flex: 0 0 auto;\n}\n.wbh-port .cr-skills-submenu__pin-btn {\n  opacity: 0;\n}\n.wbh-port .cr-skills-submenu__item:hover .cr-skills-submenu__pin-btn,\n.wbh-port .cr-skills-submenu__pin-btn--pinned {\n  opacity: 1;\n}\n.cr-connectors-submenu__suffix-connect {\n  border: none;\n  background: transparent;\n  padding: 0;\n  font: inherit;\n  cursor: pointer;\n}\n\n/* src/official-skill.css */\n.skill-card {\n  display: flex;\n  flex-direction: column;\n  padding: 16px 20px;\n  border-radius: 16px;\n  border: 1px solid var(--wb-border-card-static);\n  background: var(--wb-bg-card);\n  box-shadow: var(--wb-shadow-card-soft);\n  transition:\n    background .2s ease,\n    box-shadow .2s ease,\n    border-color .2s ease;\n  cursor: pointer;\n  min-height: 84px;\n  max-height: fit-content;\n  min-width: 0;\n  position: relative;\n  overflow: visible;\n}\n.skill-card:hover {\n  background: var(--wb-bg-card-hover);\n  box-shadow: var(--wb-shadow-card-soft);\n  border-color: #00000014;\n}\n.skill-card--disabled .skill-card-icon {\n  opacity: .35;\n}\n.skill-card--disabled .skill-card-name {\n  color: var(--wb-color-text-secondary);\n  opacity: .55;\n}\n.skill-card--disabled .skill-card-desc {\n  color: var(--wb-color-text-tertiary);\n  opacity: .55;\n}\n.skill-card--disabled .skill-card-meta {\n  opacity: .55;\n}\n.skill-card--batch-mode {\n  cursor: pointer;\n  padding-left: 34px;\n}\n.skill-card--batch-mode .skill-card-body {\n  cursor: pointer;\n}\n.skill-card--batch-mode .skill-checkbox {\n  pointer-events: none;\n}\n.skill-card-content {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  flex: 1;\n  gap: 12px;\n  min-width: 0;\n}\n.skill-card-badge {\n  flex-shrink: 0;\n  font-size: 10px;\n  font-weight: 600;\n  padding: 2px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  line-height: 1.3;\n}\n.skill-card-badge--plugin {\n  background: color-mix(in srgb, var(--wb-accent-purple) 20%, transparent);\n  color: var(--wb-accent-purple);\n}\n.skill-card-name-status-icon {\n  display: inline-flex;\n  align-items: center;\n  margin-left: 4px;\n}\n.skill-card-name-status-icon--api-key {\n  color: currentColor;\n}\n.skill-card-feature-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin-top: 6px;\n}\n.skill-card-feature-tag {\n  font-size: 10px;\n  font-weight: 500;\n  padding: 2px 6px;\n  border-radius: 3px;\n  background: color-mix(in srgb, var(--wb-border-subtle) 40%, transparent);\n  color: var(--wb-color-text-tertiary);\n  white-space: nowrap;\n}\n.skill-card-feature-tag--skills {\n  background: color-mix(in srgb, var(--wb-status-success) 15%, transparent);\n  color: var(--wb-status-success);\n}\n.skill-card-feature-tag--commands {\n  background: color-mix(in srgb, var(--wb-accent-blue) 15%, transparent);\n  color: var(--wb-accent-blue);\n}\n.skill-card-feature-tag--mcp {\n  background: color-mix(in srgb, var(--wb-status-warning) 15%, transparent);\n  color: var(--wb-status-warning);\n}\n.skill-card-feature-tag--agents {\n  background: color-mix(in srgb, var(--wb-accent-pink) 15%, transparent);\n  color: var(--wb-accent-pink);\n}\n.skill-card-feature-tag--hooks {\n  background: color-mix(in srgb, var(--wb-accent-purple) 15%, transparent);\n  color: var(--wb-accent-purple);\n}\n.skill-card-feature-tag--rules {\n  background: color-mix(in srgb, var(--wb-accent-teal) 15%, transparent);\n  color: var(--wb-accent-teal);\n}\n.skill-card-main-row {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.skill-card-icon {\n  width: 28px;\n  height: 28px;\n  border-radius: 28px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--wb-color-text-secondary);\n  flex-shrink: 0;\n  overflow: hidden;\n}\n.skill-card-icon img {\n  width: 28px;\n  height: 28px;\n  border-radius: 28px;\n}\n.skill-card-body {\n  flex: 1;\n  min-width: 0;\n  cursor: pointer;\n}\n.skill-card-name-row {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  flex-wrap: nowrap;\n  width: 100%;\n  margin-bottom: 2px;\n}\n.skill-card-name {\n  font-size: 14.5px;\n  font-weight: 650;\n  letter-spacing: -.01em;\n  color: var(--wb-color-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  flex: 1 1 auto;\n  line-height: 1.4;\n}\n.skill-card-source {\n  flex-shrink: 0;\n  font-size: 11px;\n  font-weight: 500;\n  color: var(--wb-color-text-secondary);\n  background: var(--wb-bg-hover);\n  padding: 1px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  line-height: 1.4;\n}\n.skill-card-desc {\n  margin-top: 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.6;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: normal;\n  min-height: 38px;\n  align-self: stretch;\n}\n.skill-card-desc--two-lines {\n  -webkit-line-clamp: 2;\n}\n.skill-card-stats {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 4px;\n}\n.skill-card-stat {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  font-size: 11px;\n  color: var(--wb-color-text-secondary);\n}\n.skill-card-stat svg {\n  opacity: .7;\n}\n.skill-card-installed-check {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  color: var(--wb-text-weak);\n  flex-shrink: 0;\n}\n.skill-card-installed-check svg {\n  width: 14px;\n  height: 14px;\n  stroke-width: 2.5;\n}\nbutton.skill-card-installed-check {\n  background: transparent;\n  border: 0;\n  padding: 0;\n  cursor: pointer;\n  position: relative;\n}\nbutton.skill-card-installed-check:hover {\n  color: var(--wb-color-text-primary);\n}\nbutton.skill-card-installed-check:focus-visible {\n  outline: 2px solid var(--wb-border-focus);\n  outline-offset: 1px;\n  border-radius: 4px;\n}\n.skill-card-installed-check__default,\n.skill-card-installed-check__hover {\n  position: absolute;\n  inset: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity .12s ease;\n  pointer-events: none;\n}\n.skill-card-installed-check__default {\n  opacity: 1;\n}\n.skill-card-installed-check__hover,\nbutton.skill-card-installed-check:hover .skill-card-installed-check__default {\n  opacity: 0;\n}\nbutton.skill-card-installed-check:hover .skill-card-installed-check__hover {\n  opacity: 1;\n}\n.skill-card:has(.skill-card-menu) {\n  z-index: 50;\n}\n.skill-card:has(.skill-card-menu) .skill-status {\n  z-index: 60;\n}\n.skill-card-menu-wrap {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.skill-card--installed-list-mode .skill-card-pin,\n.skill-card--installed-list-mode .skill-card-menu-wrap {\n  opacity: 0;\n  width: 0;\n  min-width: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  pointer-events: none;\n  transition: opacity .12s ease, width .12s ease;\n}\n.skill-card--installed-list-mode:hover .skill-card-pin,\n.skill-card--installed-list-mode:hover .skill-card-menu-wrap {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n  overflow: visible;\n}\n.skill-card--installed-list-mode .skill-card-pin.skill-card-pin--active {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n}\n.skill-card--installed-list-mode .skill-card-menu-wrap:has(.skill-card-menu) {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n  overflow: visible;\n}\n.skill-card-pin {\n  width: 22px;\n  height: 22px;\n  padding: 0;\n  border: none;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--wb-text-weak);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition:\n    background-color .15s ease,\n    color .15s ease,\n    opacity .12s ease;\n}\n.skill-card-pin svg {\n  width: 14px;\n  height: 14px;\n}\n.skill-card-pin:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-card-pin:focus-visible {\n  outline: 2px solid var(--wb-border-focus);\n  outline-offset: 1px;\n}\n.skill-card-pin--active {\n  color: var(--wb-color-text-primary);\n}\n.skill-card-switch-wrap {\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  line-height: 0;\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__track {\n  width: 26px;\n  height: 16px;\n  padding: 0;\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__thumb {\n  width: 12px;\n  height: 12px;\n  top: 2px;\n  left: 2px;\n  background: var(--wb-text-on-primary);\n}\n.skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__thumb {\n  transform: translate(10px);\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__icon {\n  width: 10px;\n  height: 10px;\n}\nbody.vscode-dark .skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__track,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__track {\n  background: var(--wb-brand-primary-deep);\n}\n.skill-card-menu-btn {\n  width: 22px;\n  height: 22px;\n  border-radius: 5px;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color .15s, color .15s;\n}\n.skill-card-menu-btn:hover,\n.skill-card-menu-btn.is-open {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-card-menu-btn svg {\n  width: 14px;\n  height: 14px;\n}\n.skill-card-menu {\n  position: absolute;\n  top: calc(100% + 4px);\n  right: 0;\n  min-width: 108px;\n  padding: 4px;\n  background: var(--wb-bg-popover);\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  box-shadow: 0 8px 24px var(--wb-border-default);\n  z-index: 100;\n}\n.skill-card-menu-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  border-radius: 6px;\n  cursor: pointer;\n  line-height: 1.2;\n  white-space: nowrap;\n  transition: background .1s;\n}\n.skill-card-menu-item svg {\n  width: 13px;\n  height: 13px;\n  flex-shrink: 0;\n}\n.skill-card-menu-item:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-add-btn {\n  flex-shrink: 0;\n  margin-left: 8px;\n  align-self: flex-start;\n  margin-top: 2px;\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  border: none;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background .15s, color .15s;\n  padding: 0;\n}\n.skill-add-btn svg {\n  width: 14px;\n  height: 14px;\n  stroke-width: 2;\n}\n.skill-add-btn:hover {\n  background: var(--wb-border-default);\n}\n.skill-add-btn--loading {\n  pointer-events: none;\n}\nbody.vscode-light .skill-add-btn,\nbody[data-vscode-theme-kind=vscode-light] .skill-add-btn {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\nbody.vscode-light .skill-add-btn:hover,\nbody[data-vscode-theme-kind=vscode-light] .skill-add-btn:hover {\n  background: var(--wb-bg-hover);\n}\n.skill-card:hover .skill-install-float {\n  opacity: 1;\n  transform: translateY(0);\n}\n.skill-card:hover .skill-install-float--try-now {\n  opacity: 1;\n  transform: translateY(0);\n}\n.skill-card-top {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n  gap: 0;\n}\n.skill-card-reason {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  line-height: 2;\n  font-weight: 600;\n  letter-spacing: .01em;\n  padding: 0 8px 0 10px;\n  background: var(--wb-brand-primary-subtle);\n  border: none;\n  border-radius: 16px 0 8px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: calc(100% - 24px);\n  color: var(--wb-brand-primary-deep);\n}\n.skill-card-reason:before {\n  content: \"\";\n  width: 12px;\n  height: 12px;\n  flex-shrink: 0;\n  background-color: currentColor;\n  mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path transform='matrix(1 0 0 1 0.999974 0.5)' d='M0 5.7L0 5.6727Q0 4.8316 0.0412 4.5297Q0.119 3.9597 0.4394 3.6393Q0.7597 3.319 1.3298 3.2412Q1.6316 3.2 2.4727 3.2L2.6535 3.2L3.4226 1.1492Q3.617 0.6307 4.0721 0.3154Q4.5272 0 5.0808 0Q5.8722 0 6.4001 0.5895Q6.9281 1.179 6.8412 1.9655L6.7045 3.2023Q7.3412 3.2083 7.6128 3.2295Q8.2529 3.2794 8.6392 3.4806Q9.6283 3.9957 9.9078 5.0753Q10.0169 5.4969 9.9217 6.1319Q9.8653 6.5073 9.6207 7.5672L9.6207 7.5673L9.5686 7.7932Q9.2248 9.2828 8.9033 9.7078Q8.5159 10.2199 7.9297 10.4823Q7.4433 10.7 5.9146 10.7L2.4727 10.7Q1.6316 10.7 1.3298 10.6588Q0.7597 10.581 0.4394 10.2606Q0.119 9.9403 0.0412 9.3703Q0 9.0684 0 8.2273L0 5.7ZM1 5.7L1 8.2273Q1 9.4071 1.1465 9.5536Q1.2884 9.6955 2.3999 9.6999L2.3999 4.2002Q1.2884 4.2045 1.1465 4.3464Q1 4.4929 1 5.6727L1 5.7ZM3.3999 4.0029L3.3999 9.7L5.9146 9.7Q7.2298 9.7 7.5211 9.5696Q7.8732 9.412 8.1059 9.1044Q8.2985 8.8498 8.5942 7.5683L8.6463 7.3424L8.6463 7.3424Q9.0306 5.6771 8.9397 5.3259Q8.7718 4.6771 8.1774 4.3676Q7.8555 4.2 6.1465 4.2Q5.9369 4.206 5.793 4.0535Q5.6405 3.9095 5.6465 3.6999Q5.6465 3.6862 5.6473 3.6725Q5.648 3.6587 5.6495 3.645L5.8472 1.8557Q5.885 1.5133 5.6552 1.2566Q5.4254 1 5.0808 1Q4.5465 1 4.3589 1.5003L3.4682 3.8755Q3.4428 3.946 3.3999 4.0029Z' fill-rule='evenodd' fill='black'/></svg>\");\n  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path transform='matrix(1 0 0 1 0.999974 0.5)' d='M0 5.7L0 5.6727Q0 4.8316 0.0412 4.5297Q0.119 3.9597 0.4394 3.6393Q0.7597 3.319 1.3298 3.2412Q1.6316 3.2 2.4727 3.2L2.6535 3.2L3.4226 1.1492Q3.617 0.6307 4.0721 0.3154Q4.5272 0 5.0808 0Q5.8722 0 6.4001 0.5895Q6.9281 1.179 6.8412 1.9655L6.7045 3.2023Q7.3412 3.2083 7.6128 3.2295Q8.2529 3.2794 8.6392 3.4806Q9.6283 3.9957 9.9078 5.0753Q10.0169 5.4969 9.9217 6.1319Q9.8653 6.5073 9.6207 7.5672L9.6207 7.5673L9.5686 7.7932Q9.2248 9.2828 8.9033 9.7078Q8.5159 10.2199 7.9297 10.4823Q7.4433 10.7 5.9146 10.7L2.4727 10.7Q1.6316 10.7 1.3298 10.6588Q0.7597 10.581 0.4394 10.2606Q0.119 9.9403 0.0412 9.3703Q0 9.0684 0 8.2273L0 5.7ZM1 5.7L1 8.2273Q1 9.4071 1.1465 9.5536Q1.2884 9.6955 2.3999 9.6999L2.3999 4.2002Q1.2884 4.2045 1.1465 4.3464Q1 4.4929 1 5.6727L1 5.7ZM3.3999 4.0029L3.3999 9.7L5.9146 9.7Q7.2298 9.7 7.5211 9.5696Q7.8732 9.412 8.1059 9.1044Q8.2985 8.8498 8.5942 7.5683L8.6463 7.3424L8.6463 7.3424Q9.0306 5.6771 8.9397 5.3259Q8.7718 4.6771 8.1774 4.3676Q7.8555 4.2 6.1465 4.2Q5.9369 4.206 5.793 4.0535Q5.6405 3.9095 5.6465 3.6999Q5.6465 3.6862 5.6473 3.6725Q5.648 3.6587 5.6495 3.645L5.8472 1.8557Q5.885 1.5133 5.6552 1.2566Q5.4254 1 5.0808 1Q4.5465 1 4.3589 1.5003L3.4682 3.8755Q3.4428 3.946 3.3999 4.0029Z' fill-rule='evenodd' fill='black'/></svg>\");\n  mask-repeat: no-repeat;\n  -webkit-mask-repeat: no-repeat;\n  mask-size: contain;\n  -webkit-mask-size: contain;\n}\nbody.vscode-dark .skill-card-reason,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card-reason {\n  background: color-mix(in srgb, var(--wb-brand-primary) 18%, transparent);\n  color: var(--wb-brand-primary);\n}\n.skill-card:hover .skill-install-btn {\n  opacity: 1;\n  visibility: visible;\n  pointer-events: auto;\n}\n.skills-featured-section .skill-card {\n  min-height: 109px;\n}\n.skills-featured-section--has-reasons .skill-card {\n  padding: 36px 20px 16px;\n}\n.skill-card--skeleton {\n  cursor: default;\n  pointer-events: none;\n}\n.skill-card--skeleton .skill-card-skeleton-block {\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\n.skill-card-skeleton-line {\n  height: 12px;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\n.skill-card-skeleton-line--name {\n  width: 60%;\n  height: 14px;\n}\n.skill-card-skeleton-line--desc {\n  width: 90%;\n  margin-top: 6px;\n}\n.skill-card-skeleton-toggle {\n  width: 38px;\n  height: 22px;\n  border-radius: 999px;\n  flex-shrink: 0;\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\nbody.vscode-dark .skill-card:hover,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card:hover {\n  background: var(--wb-color-bg-card-hover);\n  border-color: var(--wb-border-subtle);\n}\n:root.theme-switching .skill-card,\nbody.theme-switching .skill-card {\n  transition: none;\n}\n.category-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 28px;\n  padding: 4px 12px;\n  border-radius: 6px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all .12s;\n}\n.category-chip:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.category-chip--active {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  font-weight: 500;\n}\n.category-chip--active:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.category-chip-label {\n  flex: 1;\n}\n.category-chip-loading {\n  width: 12px;\n  height: 12px;\n  border: 2px solid var(--wb-color-text-tertiary);\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: category-chip-spin .8s linear infinite;\n}\n.category-chip-more {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.category-chip-more-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  margin-left: 2px;\n  margin-right: -4px;\n  border-radius: 4px;\n  color: var(--wb-color-text-tertiary);\n  transition: background .15s ease, color .15s ease;\n}\n.category-chip-more-btn:hover {\n  background: var(--wb-bg-hover-light);\n  color: var(--wb-color-text-primary);\n}\n.category-chip-more-btn svg {\n  width: 14px;\n  height: 14px;\n}\n.category-chip-dropdown {\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 50%;\n  transform: translate(-50%);\n  min-width: 100px;\n  padding: 4px;\n  background: var(--wb-bg-popover);\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  box-shadow: var(--wb-shadow-dialog-md);\n  z-index: 1000;\n}\n.category-chip-dropdown-item {\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-primary);\n  border-radius: 4px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.category-chip-dropdown-item:hover {\n  background: var(--wb-bg-hover);\n}\n.category-chip-dropdown-item--danger {\n  color: var(--wb-error-foreground);\n}\n.category-chip-dropdown-item--danger:hover {\n  background: color-mix(in srgb, var(--wb-error-foreground) 10%, transparent);\n}\n.skills-view {\n  position: relative;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary);\n}\n.skills-view .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.skills-view .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n.skills-view .ec-subpage-title {\n  margin: 0;\n  padding: 12px 20px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.skills-view--detail {\n  overflow: hidden;\n}\n.skills-view--detail .skill-detail-view,\n.skills-view--detail .cb-plugin-detail {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n}\n.skills-view--detail .skill-detail-back,\n.skills-view--detail .cb-plugin-detail-back {\n  display: none !important;\n}\n.skills-view-header {\n  padding: 7px 24px 16px;\n  flex-shrink: 0;\n}\n.skills-view-header h2 {\n  margin: 0;\n  font-size: 18px;\n  line-height: 1.33;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.skills-view-header p {\n  margin: 4px 0 0;\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.5;\n}\n.skills-view-header-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.skills-segment-bar {\n  display: flex;\n  align-items: center;\n  padding: 16px 0 12px;\n  gap: 16px;\n}\n.skills-segment-group {\n  display: inline-flex;\n  background: transparent;\n  border-radius: 0;\n  padding: 0;\n  gap: 20px;\n}\n.skills-segment-item {\n  padding: 0 0 4px;\n  font-size: 20px;\n  line-height: 1.4;\n  color: var(--wb-color-text-tertiary);\n  cursor: pointer;\n  border-radius: 0;\n  border: none;\n  background: transparent;\n  transition: color .12s ease;\n  font-weight: 600;\n  white-space: nowrap;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.skills-segment-item:hover {\n  color: var(--wb-color-text-secondary);\n  background: transparent;\n}\n.skills-segment-item--active {\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  box-shadow: none;\n}\n.skills-segment-item--active:hover {\n  background: transparent;\n  color: var(--wb-color-text-primary);\n}\n.skills-segment-item .skills-segment-badge-new {\n  position: absolute;\n  top: -2px;\n  right: -8px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--wb-status-error);\n  pointer-events: none;\n}\n.skills-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 24px 20px;\n  scrollbar-width: thin;\n}\n.skills-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));\n  gap: 12px;\n}\n.skills-featured-section {\n  padding-bottom: 20px;\n}\n.skills-featured-section .skill-card {\n  min-height: 109px;\n}\n.skills-featured-section--has-reasons .skill-card {\n  padding: 36px 20px 16px;\n}\n.skills-featured-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.skills-featured-title {\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.4;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--wb-color-text-primary);\n}\nbody.vscode-dark .skills-featured-title,\nbody[data-vscode-theme-kind=vscode-dark] .skills-featured-title {\n  color: var(--wb-color-text-primary);\n}\n.skills-featured-refresh-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 4px 8px;\n  height: 24px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--wb-color-text-tertiary);\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: color .12s ease, background-color .12s ease;\n  font-family: inherit;\n}\n.skills-featured-refresh-btn:hover {\n  color: var(--wb-color-text-primary);\n  background: var(--wb-bg-hover);\n}\n.skills-featured-refresh-btn:hover svg {\n  transform: rotate(90deg);\n}\n.skills-featured-refresh-btn:active {\n  opacity: .7;\n}\n.skills-featured-refresh-btn svg {\n  width: 13px;\n  height: 13px;\n  color: currentColor;\n  transition: transform .45s cubic-bezier(.4, 0, .2, 1);\n}\n.skillhub-category-chip {\n  height: 28px;\n  padding: 4px 12px;\n  border-radius: 6px;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all .12s;\n}\n.skillhub-category-chip:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.skillhub-category-chip--active {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  font-weight: 500;\n}\n.skillhub-category-chip--active:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.plugins-section .skills-grid {\n  min-height: 200px;\n}\n.skills-view--detail .skill-detail-view,\n.skills-view--detail .cb-plugin-detail {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n}\n.skills-view--detail .skill-detail-back,\n.skills-view--detail .cb-plugin-detail-back {\n  display: none !important;\n}\n.skillhub-install-btn {\n  height: 30px;\n  padding: 0 14px;\n  border-radius: 999px;\n  border: 1px solid var(--wb-border-strong);\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  flex-shrink: 0;\n  transition: all .2s ease;\n}\n.skillhub-install-btn:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n  border-color: var(--wb-color-text-secondary);\n}\n.skillhub-install-btn:active {\n  transform: scale(.97);\n}\n.skillhub-install-btn:disabled {\n  cursor: default;\n  opacity: .6;\n}\n.skillhub-install-btn--installed {\n  color: var(--wb-color-text-secondary);\n  border-color: transparent;\n  background: transparent;\n  cursor: default;\n  opacity: 1;\n}\n.skillhub-install-btn--installed:hover {\n  background: transparent;\n  border-color: transparent;\n}\n.skillhub-install-btn--installing {\n  color: var(--wb-color-text-secondary);\n  border-color: var(--wb-border-default);\n  opacity: .8;\n}\n.skillhub-install-btn--update {\n  background: transparent;\n  border-color: var(--wb-status-success);\n  color: var(--wb-status-success);\n}\n.skillhub-install-btn--update:hover:not(:disabled) {\n  background: color-mix(in srgb, var(--wb-status-success) 10%, transparent);\n}\n.skill-detail-view {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  padding: 20px 24px 24px;\n}\n.skill-detail-back {\n  border: none;\n  background: transparent;\n  padding: 4px 0;\n  margin-bottom: 14px;\n  -webkit-app-region: no-drag;\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n  text-align: left;\n  display: inline-flex;\n  align-self: flex-start;\n  align-items: center;\n  gap: 6px;\n  transition: color .2s ease;\n}\n.skill-detail-back:hover {\n  color: var(--wb-color-text-primary);\n}\n.skill-detail-header {\n  padding-bottom: 14px;\n  margin-bottom: 16px;\n  border-bottom: 1px solid var(--wb-border-subtle);\n  flex-shrink: 0;\n}\n.skill-detail-header p {\n  margin: 10px 0 0;\n  font-size: 14px;\n  line-height: 1.6;\n  color: var(--wb-color-text-primary);\n  max-height: calc(1.6em * 6);\n  overflow-y: auto;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n.skill-detail-header-main {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.skill-detail-header-main h2 {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.skill-detail-actions {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.skill-detail-stats {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-top: 8px;\n}\n.skill-detail-more {\n  position: relative;\n}\n.skill-detail-more-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n  color: var(--wb-color-text-secondary);\n  border-radius: 8px;\n  transition: all .15s ease;\n}\n.skill-detail-more-btn:hover {\n  color: var(--wb-color-text-primary);\n  background: var(--wb-bg-hover);\n}\n.skill-detail-dropdown {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  min-width: 160px;\n  margin-top: 4px;\n  padding: 4px 0;\n  background: var(--wb-bg-primary);\n  border: 1px solid var(--wb-border-subtle);\n  border-radius: 10px;\n  box-shadow: 0 8px 24px var(--wb-border-default);\n  z-index: 1000;\n  animation: skill-dropdown-in .15s ease;\n}\n.skill-detail-dropdown-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 14px;\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n  cursor: pointer;\n  transition: background .15s ease;\n  border-radius: 6px;\n  margin: 0 4px;\n}\n.skill-detail-dropdown-item:hover {\n  background: var(--wb-bg-hover);\n}\n.skill-detail-dropdown-item--danger,\n.skill-detail-dropdown-item--danger:hover {\n  color: var(--wb-error-foreground);\n}\n.skill-detail-content-box {\n  flex: 1;\n  min-height: 0;\n  border: 1px solid var(--wb-border-subtle);\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.skill-detail-toolbar {\n  display: flex;\n  justify-content: flex-end;\n  padding: 9px 16px 0;\n  gap: 4px;\n}\n.skill-detail-toolbar button {\n  width: 34px;\n  height: 34px;\n  border-radius: 10px;\n  border: 1.5px solid transparent;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: all .15s ease;\n}\n.skill-detail-toolbar button:hover {\n  background: var(--wb-bg-hover);\n}\n.skill-detail-toolbar button.active {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-detail-preview,\n.skill-detail-code {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  margin: 8px 24px 24px;\n  scrollbar-width: thin;\n}\n.skill-detail-meta-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.skill-detail-meta-item {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.skill-detail-meta-label {\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.skill-detail-meta-value {\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n}\n.skill-detail-code {\n  white-space: pre-wrap;\n  word-break: break-word;\n  font-size: 13px;\n  line-height: 1.7;\n  font-family:\n    SF Mono,\n    Menlo,\n    Monaco,\n    monospace;\n  color: var(--wb-color-text-primary);\n}\n.skill-detail-loading {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  padding: 18px 24px 24px;\n}\n.skill-detail-skeleton-line {\n  height: 14px;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\n.skill-detail-skeleton-line--title {\n  width: 40%;\n  height: 20px;\n  margin-bottom: 6px;\n}\n.skill-detail-skeleton-line--full {\n  width: 100%;\n}\n.skill-detail-skeleton-line--medium {\n  width: 72%;\n}\n.skill-detail-skeleton-line--short {\n  width: 45%;\n}\n\n/* src/official-connector.css */\n.connector-card {\n  display: grid;\n  grid-template-columns: 40px minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  row-gap: 8px;\n  align-items: start;\n  align-content: start;\n  min-height: 88px;\n  padding: 14px 16px;\n  border: 1px solid var(--wb-border-card-static);\n  border-radius: 16px;\n  background: var(--wb-bg-card);\n  box-shadow: var(--wb-shadow-card-soft);\n  transition: all .25s cubic-bezier(.4, 0, .2, 1);\n  cursor: pointer;\n}\n.connector-card:hover {\n  border-color: var(--wb-border-default);\n  background: var(--wb-bg-card-hover);\n  box-shadow: var(--wb-shadow-card-soft);\n}\n.connector-card--skeleton {\n  pointer-events: none;\n  cursor: default;\n}\n.connector-card--incompatible {\n  opacity: .55;\n}\n.connector-card--incompatible:hover {\n  border-color: var(--wb-border-default);\n  background: var(--wb-bg-card);\n  transform: none;\n  box-shadow: none;\n}\n.connector-card-icon {\n  grid-column: 1;\n  grid-row: 1;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--wb-color-text-primary);\n  font-size: 16px;\n  font-weight: 600;\n  overflow: hidden;\n}\n.connector-card-main {\n  display: contents;\n}\n.connector-card-name-row {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: center;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n.connector-card-name {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.connector-card-status-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  background: var(--wb-status-success);\n}\n.connector-card-status-dot--connected {\n  background: var(--wb-status-success);\n}\n.connector-card-status-dot--connecting {\n  background: var(--wb-status-warning);\n  animation: connector-status-pulse 1.2s ease-in-out infinite;\n}\n.connector-card-status-dot--error {\n  background: var(--wb-status-error);\n}\n.connector-card-badge {\n  padding: 2px 8px;\n  border-radius: 6px;\n  font-size: 11px;\n  line-height: 1.4;\n  color: var(--wb-color-text-secondary);\n  background: var(--wb-bg-hover);\n  white-space: nowrap;\n}\n.connector-card-desc {\n  grid-column: 1 / -1;\n  grid-row: 2;\n  margin-top: 2px;\n  font-size: 11px;\n  line-height: 18px;\n  color: var(--wb-color-text-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.connector-card-action {\n  grid-column: 3;\n  grid-row: 1;\n  align-self: start;\n  display: inline-flex;\n  align-items: center;\n  margin-top: 4px;\n  margin-right: 4px;\n}\n:root.theme-switching .connector-card,\nbody.theme-switching .connector-card,\n:root.theme-switching .connector-connect-btn,\nbody.theme-switching .connector-connect-btn,\n:root.theme-switching .connector-detail-tool-item,\nbody.theme-switching .connector-detail-tool-item {\n  transition: none;\n}\n.connector-detail-overlay {\n  position: fixed;\n  inset: 0;\n  background: #00000073;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 10000;\n  animation: connector-detail-fade-in .15s ease-out;\n}\n.connector-detail-modal {\n  position: relative;\n  width: 380px;\n  max-width: 90%;\n  background: var(--wb-bg-card);\n  border: 1px solid var(--wb-border-default);\n  border-radius: 16px;\n  padding: 32px 28px 24px;\n  box-shadow: 0 20px 60px #0003;\n  text-align: center;\n  animation: connector-detail-slide-in .2s ease-out;\n}\n.connector-detail-close {\n  position: absolute;\n  top: 14px;\n  right: 14px;\n  z-index: 2;\n  width: 28px;\n  height: 28px;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all .15s ease;\n}\n.connector-detail-close:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-icon {\n  width: 52px;\n  height: 52px;\n  border-radius: 14px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 14px;\n  color: #fff;\n  font-size: 20px;\n  font-weight: 600;\n  overflow: hidden;\n}\n.connector-detail-icon img {\n  width: 28px;\n  height: 28px;\n  border-radius: 6px;\n}\n.connector-detail-name {\n  margin: 0 0 6px;\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-desc {\n  margin: 0 0 20px;\n  font-size: 13px;\n  line-height: 1.5;\n  color: var(--wb-color-text-secondary);\n}\n.connector-detail-version-banner {\n  margin: 0 0 16px;\n  padding: 10px 12px;\n  border: 1px solid var(--wb-status-warning);\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--wb-status-warning) 10%, transparent);\n  color: var(--wb-color-text-primary);\n  font-size: 12px;\n  line-height: 1.5;\n}\n.connector-detail-headers {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 18px;\n  text-align: left;\n}\n.connector-detail-section-title {\n  font-size: 11px;\n  font-weight: 600;\n  color: var(--wb-color-text-secondary);\n  text-transform: uppercase;\n  letter-spacing: .5px;\n}\n.connector-detail-empty-config {\n  font-size: 13px;\n  color: var(--wb-color-text-tertiary);\n  text-align: center;\n  padding: 12px 0;\n  margin: 0;\n}\n.connector-detail-header-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.connector-detail-header-label {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--wb-color-text-secondary);\n  text-transform: capitalize;\n}\n.connector-detail-header-input {\n  height: 36px;\n  padding: 0 12px;\n  border: 1px solid var(--wb-border-input);\n  border-radius: 8px;\n  background: var(--wb-bg-input-inset);\n  color: var(--wb-color-text-primary);\n  font-size: 13px;\n  outline: none;\n  transition: border-color .15s;\n}\n.connector-detail-header-input::placeholder {\n  color: var(--wb-color-text-tertiary);\n}\n.connector-detail-header-input:focus {\n  border-color: var(--wb-border-input);\n}\n.connector-detail-actions {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  margin-bottom: 16px;\n}\n.connector-detail-btn {\n  height: 36px;\n  padding: 0 18px;\n  border-radius: 10px;\n  border: none;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  transition: all .15s ease;\n}\n.connector-detail-btn:disabled {\n  opacity: .4;\n  cursor: not-allowed;\n}\n.connector-detail-btn svg {\n  width: 14px;\n  height: 14px;\n  stroke: currentColor;\n}\n.connector-detail-btn--primary {\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n}\n.connector-detail-btn--primary:hover {\n  background: var(--wb-button-primary-bg-hover);\n}\n.connector-detail-btn--secondary {\n  background: var(--wb-bg-card);\n  border: 1px solid var(--wb-border-default);\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-btn--secondary:hover {\n  background: var(--wb-bg-hover);\n  border-color: var(--wb-border-default);\n}\n.connector-detail-btn--try-standalone {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 16px;\n  border: 1px solid var(--wb-button-primary-bg);\n  border-radius: 6px;\n  background: transparent;\n  color: var(--wb-button-primary-bg);\n  font-size: 13px;\n  cursor: pointer;\n  transition: background .15s, color .15s;\n}\n.connector-detail-btn--try-standalone:hover {\n  background: color-mix(in srgb, var(--wb-button-primary-bg) 10%, transparent);\n}\n.connector-detail-btn--reset {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 6px 16px;\n  border: 1px solid #ff313f;\n  border-radius: 6px;\n  background: transparent;\n  color: #ff313f;\n  font-size: 13px;\n  cursor: pointer;\n  transition: background .15s, color .15s;\n}\n.connector-detail-btn--reset:hover:not(:disabled) {\n  background: #ff313f1a;\n}\n.connector-detail-btn--reset:disabled {\n  opacity: .4;\n  cursor: not-allowed;\n}\n.connector-detail-expand {\n  padding-top: 12px;\n}\n.connector-detail-expand-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 0;\n  border: none;\n  background: none;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  cursor: pointer;\n  transition: color .15s;\n}\n.connector-detail-expand-btn:hover {\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-expand-btn svg {\n  stroke: currentColor;\n}\n.connector-detail-tools {\n  margin-top: 10px;\n  max-height: 200px;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  text-align: left;\n}\n.connector-detail-tool-item {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 8px 10px;\n  border-radius: 8px;\n  transition: background .12s;\n}\n.connector-detail-tool-item:hover {\n  background: var(--wb-bg-hover);\n}\n.connector-detail-tool-name {\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-tool-desc {\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.4;\n}\n.connector-detail-modal--connected {\n  width: min(630px, 50vw);\n  min-width: 550px;\n  max-width: calc(100vw - 32px);\n  max-height: min(640px, calc(100vh - 48px));\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  border: 0;\n  border-radius: 24px;\n  text-align: center;\n}\n.connector-detail-modal-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 48px 0 24px;\n  scrollbar-width: none;\n}\n.connector-detail-modal-body::-webkit-scrollbar {\n  width: 0;\n  display: none;\n}\n.connector-detail-modal-fade {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 108px;\n  --connector-fade-solid: 48px;\n  background:\n    linear-gradient(\n      to bottom,\n      var(--wb-bg-card, #ffffff) 0%,\n      var(--wb-bg-card, #ffffff) var(--connector-fade-solid),\n      color-mix(in srgb, var(--wb-bg-card, #ffffff) 0%, transparent) 100%);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity .18s ease;\n  z-index: 1;\n}\n.connector-detail-modal-fade.is-visible {\n  opacity: 1;\n}\n.connector-detail-modal-bottom-fade {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 60px;\n  background:\n    linear-gradient(\n      to bottom,\n      color-mix(in srgb, var(--wb-bg-card, #ffffff) 0%, transparent) 0%,\n      var(--wb-bg-card, #ffffff) 100%);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity .18s ease;\n  z-index: 1;\n}\n.connector-detail-modal-bottom-fade.is-visible {\n  opacity: 1;\n}\n.connector-detail-modal--connected .connector-detail-close {\n  top: 16px;\n  right: 16px;\n}\n.connector-detail-modal--connected .connector-detail-name {\n  margin: 20px 24px 12px;\n  font-size: 20px;\n  line-height: 28px;\n  font-weight: 600;\n}\n.connector-detail-modal--connected .connector-detail-desc {\n  margin: 0 auto 20px;\n  padding: 0 48px;\n  font-size: 14px;\n  line-height: 22px;\n  color: color-mix(in srgb, var(--wb-color-text-primary) 90%, transparent);\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.connector-detail-modal--connected .connector-detail-version-banner {\n  margin: 0 24px 16px;\n  text-align: left;\n}\n.connector-detail-modal--connected .connector-detail-actions {\n  margin: 0 0 32px;\n  gap: 12px;\n}\n.connector-detail-modal--connected .connector-detail-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  height: 32px;\n  padding: 0 24px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n}\n.connector-detail-modal--connected .connector-detail-btn svg {\n  width: 16px;\n  height: 16px;\n}\n.connector-detail-modal--connected .connector-detail-btn--try {\n  border: 0;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n}\n.connector-detail-modal--connected .connector-detail-btn--try svg {\n  color: var(--wb-button-primary-fg);\n}\n.connector-detail-modal--connected .connector-detail-btn--try:hover:not(:disabled) {\n  background: var(--wb-button-primary-bg-hover);\n}\n.connector-detail-modal--connected .connector-detail-btn--try-loading {\n  background: var(--wb-connector-detail-try-loading-bg);\n  color: var(--wb-palette-white-100);\n}\n.connector-detail-modal--connected .connector-detail-btn--try-loading svg {\n  color: var(--wb-palette-white-100);\n  animation: connector-spin 1s linear infinite;\n}\n.connector-detail-modal--connected .connector-detail-btn--try-loading:hover:not(:disabled) {\n  background: var(--wb-connector-detail-try-loading-bg);\n  opacity: 1;\n}\n.connector-detail-modal--connected .connector-detail-btn--reset {\n  border: 1px solid var(--wb-button-secondary-border);\n  background: var(--wb-button-secondary-bg);\n  color: var(--wb-button-secondary-fg);\n}\n.connector-detail-modal--connected .connector-detail-btn--reset svg {\n  color: var(--wb-button-secondary-fg);\n}\n.connector-detail-modal--connected .connector-detail-btn--reset:hover:not(:disabled) {\n  background: var(--wb-button-secondary-bg-hover);\n}\n.connector-detail-modal--connected .connector-detail-expand {\n  padding: 32px 0 0;\n  text-align: left;\n}\n.connector-detail-modal--connected .connector-detail-expand-btn {\n  width: 100%;\n  padding: 0 24px;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n  transition: color .15s ease;\n}\n.connector-detail-modal--connected .connector-detail-expand-btn svg {\n  margin-right: 4px;\n  vertical-align: middle;\n}\n.connector-detail-modal--connected .connector-detail-expand-btn:hover:not(:disabled) {\n  color: var(--wb-color-text-secondary);\n}\n.connector-detail-modal--connected .connector-detail-expand-btn:hover:not(:disabled) svg {\n  color: var(--wb-color-text-secondary);\n}\n.connector-detail-modal--connected .connector-detail-tools-wrapper {\n  position: relative;\n  margin: 12px 24px 0;\n  padding: 8px 16px;\n  border-radius: 24px;\n  background: var(--wb-connector-detail-surface-bg);\n}\n.connector-detail-modal--connected .connector-detail-tools {\n  max-height: 400px;\n  overflow-y: auto;\n  scrollbar-width: none;\n}\n.connector-detail-modal--connected .connector-detail-tools::-webkit-scrollbar {\n  width: 0;\n  display: none;\n}\n.connector-detail-modal--connected .connector-detail-modal-body:hover ~ .connector-detail-modal-scroll-thumb,\n.connector-detail-modal--connected .connector-detail-modal-scroll-thumb:hover,\n.connector-detail-modal--connected .connector-detail-modal-scroll-thumb.is-dragging,\n.connector-detail-modal--connected .connector-detail-tools-wrapper:hover .connector-detail-tools-scroll-thumb,\n.connector-detail-modal--connected .connector-detail-tools-scroll-thumb:hover,\n.connector-detail-modal--connected .connector-detail-tools-scroll-thumb.is-dragging {\n  opacity: 1;\n}\n.connector-detail-modal--connected .connector-detail-modal-scroll-thumb,\n.connector-detail-modal--connected .connector-detail-tools-scroll-thumb {\n  position: absolute;\n  top: 0;\n  right: 4px;\n  width: 4px;\n  border-radius: 12px;\n  background: #0003;\n  opacity: 0;\n  touch-action: none;\n  transition: opacity .15s ease, transform .1s ease-out;\n}\n.connector-detail-modal--connected .connector-detail-modal-scroll-thumb.is-dragging,\n.connector-detail-modal--connected .connector-detail-tools-scroll-thumb.is-dragging {\n  transition: opacity .15s ease;\n}\n.connector-detail-modal--connected .connector-detail-tool-item {\n  padding: 10px 0;\n  border-radius: 0;\n}\n.connector-detail-modal--connected .connector-detail-tool-item:hover {\n  background: transparent;\n}\n.connector-detail-modal--connected .connector-detail-tool-desc {\n  color: var(--wb-color-text-tertiary);\n}\n.connector-detail-flow {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n}\n.connector-detail-flow-avatar {\n  display: inline-flex;\n  width: 68px;\n  height: 68px;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  border-radius: 50%;\n}\n.connector-detail-flow-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.connector-detail-flow-avatar--connector {\n  color: var(--wb-color-text-primary);\n  font-size: 28px;\n  font-weight: 600;\n}\n.connector-detail-flow-avatar--connector img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: 50%;\n}\n.connector-detail-flow-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n.connector-detail-flow-icon span {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--wb-connector-detail-flow-dot-bg);\n}\n.connector-detail-examples {\n  display: flex;\n  flex-direction: column;\n  padding: 0 24px;\n}\n.connector-detail-examples-title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 16px;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-examples-title svg {\n  width: 16px;\n  height: 16px;\n  flex: none;\n  color: var(--wb-color-text-secondary);\n}\n.connector-detail-example {\n  display: flex;\n  width: 100%;\n  min-height: 46px;\n  align-items: center;\n  gap: 16px;\n  padding: 12px 16px;\n  border: 0;\n  border-radius: 16px;\n  background: var(--wb-palette-gray-1);\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 22px;\n  text-align: left;\n  transition: background .15s ease;\n}\n.connector-detail-example span {\n  flex: 1;\n  min-width: 0;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.connector-detail-example svg {\n  width: 16px;\n  height: 16px;\n  flex: none;\n  color: currentColor;\n}\n.connector-detail-example + .connector-detail-example {\n  margin-top: 12px;\n}\n.connector-detail-example:hover:not(:disabled) {\n  background: var(--wb-palette-gray-5);\n}\n.connector-detail-example:disabled {\n  cursor: default;\n  opacity: .6;\n}\n.connector-detail-modal--connected .connector-detail-flow {\n  gap: 14px;\n}\n.connector-detail-modal--connected .connector-detail-flow-avatar {\n  width: 56px;\n  height: 56px;\n}\n.connector-detail-modal--connected .connector-detail-examples {\n  padding: 0 16px;\n}\n.connector-detail-repos-hint {\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  margin: 12px 0;\n}\n.connector-detail-repos {\n  margin: 12px 0;\n}\n.connector-detail-repos-title {\n  font-size: 13px;\n  font-weight: 500;\n  margin-bottom: 8px;\n  color: var(--wb-color-text-primary);\n}\n.connector-detail-repos-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 200px;\n  overflow-y: auto;\n}\n.connector-detail-repos-item {\n  padding: 6px 10px;\n  border-radius: 6px;\n  background: var(--wb-bg-secondary);\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n  word-break: break-all;\n}\n:root.dark .connector-detail-btn--try-loading,\n:root.cb-dark .connector-detail-btn--try-loading,\n:root .dark .connector-detail-btn--try-loading,\n:root .cb-dark .connector-detail-btn--try-loading,\n.cbChat.dark .connector-detail-btn--try-loading {\n  background: var(--wb-connector-detail-try-loading-bg);\n  color: var(--wb-color-text-primary);\n}\n:root.dark .connector-detail-btn--try-loading svg,\n:root.cb-dark .connector-detail-btn--try-loading svg,\n:root .dark .connector-detail-btn--try-loading svg,\n:root .cb-dark .connector-detail-btn--try-loading svg,\n.cbChat.dark .connector-detail-btn--try-loading svg {\n  color: var(--wb-color-text-primary);\n}\n:root.dark .connector-detail-btn--try-loading:hover:not(:disabled),\n:root.cb-dark .connector-detail-btn--try-loading:hover:not(:disabled),\n:root .dark .connector-detail-btn--try-loading:hover:not(:disabled),\n:root .cb-dark .connector-detail-btn--try-loading:hover:not(:disabled),\n.cbChat.dark .connector-detail-btn--try-loading:hover:not(:disabled) {\n  background: var(--wb-connector-detail-try-loading-bg);\n  opacity: 1;\n}\n:root.dark .connector-detail-example,\n:root.cb-dark .connector-detail-example,\n:root .dark .connector-detail-example,\n:root .cb-dark .connector-detail-example,\n.cbChat.dark .connector-detail-example {\n  background: var(--wb-connector-detail-surface-bg);\n  color: var(--wb-color-text-primary);\n}\n:root.dark .connector-detail-example:hover:not(:disabled),\n:root.cb-dark .connector-detail-example:hover:not(:disabled),\n:root .dark .connector-detail-example:hover:not(:disabled),\n:root .cb-dark .connector-detail-example:hover:not(:disabled),\n.cbChat.dark .connector-detail-example:hover:not(:disabled) {\n  background: var(--wb-connector-detail-surface-bg);\n  opacity: .85;\n}\n:root.dark .connector-detail-tools-wrapper,\n:root.cb-dark .connector-detail-tools-wrapper,\n:root .dark .connector-detail-tools-wrapper,\n:root .cb-dark .connector-detail-tools-wrapper,\n.cbChat.dark .connector-detail-tools-wrapper {\n  background: var(--wb-connector-detail-surface-bg);\n}\n.connector-card-badge {\n  flex: none;\n  flex-shrink: 0;\n  padding: 0 6px;\n  height: 16px;\n  line-height: 16px;\n  border-radius: 8px;\n  font-size: 10px;\n  white-space: nowrap;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  border: 1px solid var(--wb-border-default);\n}\n.connector-card-badge--warn {\n  color: #b45309;\n  border-color: #f59e0b55;\n  background: #f59e0b1a;\n}\n.wbh-oauthPaste {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  margin: 8px 0;\n}\n.wbh-oauthPaste input {\n  flex: 1 1 auto;\n  min-width: 0;\n  height: 28px;\n  padding: 0 10px;\n  border-radius: 8px;\n  border: 1px solid var(--wb-border-default);\n  background: var(--wb-bg-card);\n  color: var(--wb-color-text-primary);\n  font-size: 12px;\n}\n.wbh-oauthPaste input::placeholder {\n  color: var(--wb-color-text-secondary);\n}\n\n/* src/official-skeleton.css */\n.wb-card__skeleton {\n  display: flex;\n  flex-direction: column;\n  gap: var(--wb-spacing-3);\n}\n.wb-card__skeleton-row {\n  height: 12px;\n  border-radius: var(--wb-radius-sm);\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n@keyframes wb-card-skeleton-shimmer {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n.wbh-skelCard {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px 20px;\n  border-radius: 16px;\n  border: 1px solid var(--wb-border-card-static,#eee);\n  background: var(--wb-bg-card,#fff);\n  min-height: 120px;\n}\n.wbh-skelHead {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.wbh-skelAvatar {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  flex-shrink: 0;\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n.wbh-skelLines {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.wbh-skelRow {\n  height: 12px;\n  border-radius: var(--wb-radius-sm,4px);\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n.wbh-skelRow.short {\n  width: 60%;\n}\n\n/* src/official-button.css */\n.wb-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  white-space: nowrap;\n  user-select: none;\n  text-decoration: none;\n  transition:\n    background-color .2s ease,\n    color .2s ease,\n    border-color .2s ease;\n  font-family:\n    PingFang SC,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    Segoe UI,\n    sans-serif;\n  font-weight: 500;\n  border-radius: var(--wb-button-border-radius-medium);\n}\n.wb-button--medium {\n  height: var(--wb-button-height-medium);\n  padding: 0 var(--wb-button-padding-medium);\n  font-size: var(--wb-button-font-size-medium);\n  gap: var(--wb-button-gap-medium);\n  min-width: var(--wb-button-min-width-medium);\n  line-height: var(--wb-button-line-height-medium);\n}\n.wb-button--small {\n  height: var(--wb-button-height-small);\n  padding: 0 var(--wb-button-padding-small);\n  font-size: var(--wb-button-font-size-small);\n  gap: var(--wb-button-gap-small);\n  min-width: var(--wb-button-min-width-small);\n  border-radius: var(--wb-button-border-radius-small);\n  line-height: var(--wb-button-line-height-small);\n}\n.wb-button--small .wb-button__icon {\n  width: var(--wb-button-icon-size-small);\n  height: var(--wb-button-icon-size-small);\n}\n.wb-button--secondary {\n  background-color: var(--wb-button-secondary-bg);\n  color: var(--wb-button-secondary-fg);\n  border: 1px solid var(--wb-button-secondary-border);\n}\n.wb-button--secondary:hover:not(:disabled) {\n  background-color: var(--wb-button-secondary-bg-hover);\n}\n.wb-button--secondary:active:not(:disabled) {\n  background-color: var(--wb-button-secondary-bg-active);\n}\n.wb-button--secondary:disabled,\n.wb-button--secondary.wb-button--disabled {\n  color: var(--wb-button-secondary-fg-disabled);\n  cursor: not-allowed;\n}\n.wb-button--icon-only {\n  min-width: unset;\n  padding: 0;\n}\n.wb-button--icon-only.wb-button--medium {\n  width: var(--wb-button-height-medium);\n  height: var(--wb-button-height-medium);\n}\n.wb-button--icon-only.wb-button--small {\n  width: var(--wb-button-height-small);\n  height: var(--wb-button-height-small);\n}\n.wb-button--icon-only.wb-button--large {\n  width: var(--wb-button-height-large);\n  height: var(--wb-button-height-large);\n}\n.wb-button__icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--wb-button-icon-size-medium);\n  height: var(--wb-button-icon-size-medium);\n  flex-shrink: 0;\n}\n.wb-button__icon svg {\n  width: 100%;\n  height: 100%;\n  color: currentColor;\n  fill: currentColor;\n}\n\n/* src/official.css */\n:root {\n  --wb-palette-black-10: rgba(0, 0, 0, .1);\n  --wb-palette-black-20: rgba(0, 0, 0, .2);\n  --wb-palette-black-30: rgba(0, 0, 0, .3);\n  --wb-palette-black-40: rgba(0, 0, 0, .4);\n  --wb-palette-black-50: rgba(0, 0, 0, .5);\n  --wb-palette-black-60: rgba(0, 0, 0, .6);\n  --wb-palette-black-70: rgba(0, 0, 0, .7);\n  --wb-palette-black-75: rgba(0, 0, 0, .75);\n  --wb-palette-black-90: rgba(0, 0, 0, .9);\n  --wb-palette-black-100: #000000;\n  --wb-palette-white-10: rgba(255, 255, 255, .1);\n  --wb-palette-white-20: rgba(255, 255, 255, .2);\n  --wb-palette-white-30: rgba(255, 255, 255, .3);\n  --wb-palette-white-40: rgba(255, 255, 255, .4);\n  --wb-palette-white-50: rgba(255, 255, 255, .5);\n  --wb-palette-white-60: rgba(255, 255, 255, .6);\n  --wb-palette-white-70: rgba(255, 255, 255, .7);\n  --wb-palette-white-75: rgba(255, 255, 255, .75);\n  --wb-palette-white-80: rgba(255, 255, 255, .8);\n  --wb-palette-white-90: rgba(255, 255, 255, .9);\n  --wb-palette-white-100: #FFFFFF;\n  --wb-palette-brand-1: #DFF7F2;\n  --wb-palette-brand-2: #BFF0E6;\n  --wb-palette-brand-3: #9FE8D9;\n  --wb-palette-brand-4: #80E1CD;\n  --wb-palette-brand-5: #60D9C0;\n  --wb-palette-brand-7: #40D1B3;\n  --wb-palette-brand-8: #00C29A;\n  --wb-palette-brand-9: #009273;\n  --wb-palette-brand-10: #00614D;\n  --wb-palette-gray-1: #FAFAFA;\n  --wb-palette-gray-2: #F7F7F7;\n  --wb-palette-gray-3: #F2F2F2;\n  --wb-palette-gray-4: #EBEBEB;\n  --wb-palette-gray-5: #E6E6E6;\n  --wb-palette-green-1: #E7F8F0;\n  --wb-palette-green-2: #C2EFD6;\n  --wb-palette-green-3: #A3E7C2;\n  --wb-palette-green-4: #85DFAD;\n  --wb-palette-green-5: #66D799;\n  --wb-palette-green-6: #47CF84;\n  --wb-palette-green-7: #29C770;\n  --wb-palette-green-8: #0CBF5B;\n  --wb-palette-green-9: #088F50;\n  --wb-palette-orange-1: #FFEDDF;\n  --wb-palette-orange-2: #FFDCBF;\n  --wb-palette-orange-3: #FFCA9F;\n  --wb-palette-orange-4: #FFB980;\n  --wb-palette-orange-5: #FFA760;\n  --wb-palette-orange-6: #FF9540;\n  --wb-palette-orange-7: #FF8420;\n  --wb-palette-orange-8: #FF7800;\n  --wb-palette-orange-9: #C04100;\n  --wb-palette-orange-10: #800F00;\n  --wb-palette-red-1: #FCE8E8;\n  --wb-palette-red-2: #F9D1D1;\n  --wb-palette-red-3: #F5B9B9;\n  --wb-palette-red-4: #F2A2A2;\n  --wb-palette-red-5: #EF8B8B;\n  --wb-palette-red-6: #EC7474;\n  --wb-palette-red-7: #E85C5C;\n  --wb-palette-red-8: #F64041;\n  --wb-palette-red-9: #B42C3F;\n  --wb-palette-red-10: #821238;\n  --wb-palette-blue-1: #EAF2FF;\n  --wb-palette-blue-2: #BFDBFE;\n  --wb-palette-blue-3: #93C5FD;\n  --wb-palette-blue-4: #60a5fa;\n  --wb-palette-blue-5: #4f86ff;\n  --wb-palette-blue-6: #4F7DF3;\n  --wb-palette-blue-7: #3370ff;\n  --wb-palette-blue-8: #2563eb;\n  --wb-palette-blue-9: #1565c0;\n  --wb-palette-blue-10: #0550ae;\n  --wb-palette-purple-1: #f5f2ff;\n  --wb-palette-purple-2: #F1EEFF;\n  --wb-palette-purple-3: #e0d4ff;\n  --wb-palette-purple-4: #c8a2ff;\n  --wb-palette-purple-5: #b0a0c8;\n  --wb-palette-purple-6: #7C5CFC;\n  --wb-palette-purple-7: #7B61FF;\n  --wb-palette-purple-8: #7c3aed;\n  --wb-palette-purple-9: #8250df;\n  --wb-palette-purple-10: #6C4DFF;\n  --wb-palette-cyan-1: #E8F7FF;\n  --wb-palette-cyan-2: #a6d5da;\n  --wb-palette-cyan-3: #6fc3df;\n  --wb-palette-cyan-4: #22D3EE;\n  --wb-palette-cyan-5: #06B6D4;\n  --wb-palette-cyan-6: #14b8a6;\n  --wb-palette-cyan-7: #00796b;\n  --wb-color-bg-primary-default: var(--wb-palette-gray-3);\n  --wb-color-bg-primary-hover: var(--wb-palette-gray-4);\n  --wb-color-bg-primary-active: var(--wb-palette-gray-5);\n  --wb-color-bg-primary-hover-strong: var(--wb-palette-gray-5);\n  --wb-color-bg-secondary-default: var(--wb-palette-white-100);\n  --wb-color-bg-secondary-hover-active: var(--wb-palette-gray-2);\n  --wb-color-border-primary: var(--wb-palette-gray-5);\n  --wb-color-border-secondary: var(--wb-palette-gray-4);\n  --wb-color-border-tertiary: var(--wb-palette-gray-3);\n  --wb-color-border-focus: var(--wb-palette-black-75);\n  --wb-color-mask-color: var(--wb-palette-black-60);\n  --wb-color-text-primary: var(--wb-palette-black-100);\n  --wb-color-text-secondary: var(--wb-palette-black-70);\n  --wb-color-text-tertiary: var(--wb-palette-black-50);\n  --wb-color-text-placeholder: var(--wb-palette-black-50);\n  --wb-color-text-disabled: var(--wb-palette-black-30);\n  --wb-color-text-hint: var(--wb-palette-black-30);\n  --wb-color-text-solid: var(--wb-palette-black-100);\n  --wb-color-text-brand-default: var(--wb-palette-brand-8);\n  --wb-color-text-brand-hover: var(--wb-palette-brand-7);\n  --wb-color-text-brand-focus: var(--wb-palette-brand-5);\n  --wb-color-text-brand-active: var(--wb-palette-brand-9);\n  --wb-color-text-brand-disabled: var(--wb-palette-brand-3);\n  --wb-color-accent-brand: var(--wb-palette-brand-8);\n  --wb-color-text-link-default: #1470B4;\n  --wb-color-text-link-hover: #0E58A0;\n  --wb-color-text-error-default: var(--wb-palette-red-8);\n  --wb-color-text-error-hover: var(--wb-palette-red-7);\n  --wb-color-text-error-focus: var(--wb-palette-red-5);\n  --wb-color-text-error-active: var(--wb-palette-red-9);\n  --wb-color-text-error-disabled: var(--wb-palette-red-3);\n  --wb-color-text-success-default: var(--wb-palette-green-8);\n  --wb-color-text-success-hover: var(--wb-palette-green-7);\n  --wb-color-text-success-focus: var(--wb-palette-green-5);\n  --wb-color-text-success-active: var(--wb-palette-green-9);\n  --wb-color-text-success-disabled: var(--wb-palette-green-3);\n  --wb-color-text-warning-default: var(--wb-palette-orange-8);\n  --wb-color-text-warning-hover: var(--wb-palette-orange-7);\n  --wb-brand-primary: var(--wb-palette-brand-8);\n  --wb-text-strong: var(--wb-color-text-primary);\n  --wb-text-medium: var(--wb-color-text-secondary);\n  --wb-text-weak: var(--wb-color-text-tertiary);\n  --wb-text-disable: var(--wb-color-text-disabled);\n  --wb-text-white: var(--wb-palette-white-100);\n  --wb-text-muted: var(--wb-color-text-disabled);\n  --wb-text-link: var(--wb-palette-brand-8);\n  --wb-text-on-primary: var(--wb-palette-white-100);\n  --wb-bg-primary: var(--wb-palette-white-100);\n  --wb-bg-secondary: var(--wb-color-bg-secondary-hover-active);\n  --wb-bg-tertiary: var(--wb-color-bg-primary-hover);\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 5%, transparent);\n  --wb-bg-hover-light: var(--wb-palette-gray-3);\n  --wb-bg-active: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-bg-overlay: var(--wb-palette-black-40);\n  --wb-color-bg-card-default: var(--wb-bg-hover-light);\n  --wb-color-bg-card-hover: var(--wb-color-bg-primary-hover-strong);\n  --wb-border-default: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-border-weak: color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent);\n  --wb-border-subtle: var(--wb-palette-gray-3);\n  --wb-border-strong: var(--wb-color-border-primary);\n  --wb-border-focus: var(--wb-color-border-focus);\n  --wb-control-selected-bg: var(--wb-palette-black-90);\n  --wb-control-selected-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-control-selected-fg: var(--wb-palette-white-100);\n  --wb-control-selected-bg-active: var(--wb-palette-black-100);\n  --wb-control-action-bg: var(--wb-palette-brand-5);\n  --wb-success: var(--wb-status-success);\n  --wb-warning: var(--wb-status-warning);\n  --wb-error: var(--wb-status-error);\n  --wb-info: var(--wb-status-info);\n  --wb-warning-soft: var(--wb-status-warning-soft);\n  --wb-error-foreground: var(--wb-status-error);\n  --wb-text-inverse: var(--wb-text-white);\n  --wb-bg-inverse: var(--wb-color-text-primary);\n  --wb-text-on-inverse: var(--wb-text-white);\n  --wb-icon-default: var(--wb-icon-primary);\n  --wb-home-bg-primary: #f2f2f2;\n  --wb-home-bg-secondary: #ffffff;\n  --wb-home-input-slot-bg:\n    linear-gradient(\n      180deg,\n      #f0f0f0 0%,\n      #f5f5f5 100%);\n  --wb-quick-action-sub-item-bg: #ebebeb;\n  --wb-bg-slate: #64748B;\n  --wb-bg-gold-start: #C2A979;\n  --wb-bg-gold-end: #8F6E30;\n  --wb-brand-primary-subtle: rgba(0, 194, 154, .12);\n  --wb-brand-primary-deep: #087866;\n  --wb-brand-accent: #1f1f1f;\n  --wb-brand-accent-bg: var(--wb-palette-purple-1);\n  --wb-brand-icon-bg: var(--wb-palette-green-1);\n  --wb-bg-card: var(--wb-palette-white-100);\n  --wb-bg-card-strong: #F5F5F5;\n  --wb-bg-item-selected: #f4f5f5;\n  --wb-bg-popover: var(--wb-palette-white-100);\n  --wb-bg-elevated: #3c3c3c;\n  --wb-bg-tab-active: #f1f3f6;\n  --wb-bg-success-soft: #e8f5e9;\n  --wb-bg-error-soft: #fef2f2;\n  --wb-bg-purple-soft: rgba(124, 58, 237, .12);\n  --wb-bg-content: var(--wb-palette-white-100);\n  --wb-bg-input-inset: transparent;\n  --wb-bg-tooltip: var(--wb-palette-black-90);\n  --wb-bg-tooltip-hover: var(--wb-palette-black-75);\n  --wb-bg-modal: var(--wb-palette-white-100);\n  --wb-bg-skeleton: rgba(128, 128, 128, .1);\n  --wb-border-card: rgba(0, 0, 0, .08);\n  --wb-border-card-static: #f2f2f2;\n  --wb-border-hover: rgba(0, 0, 0, .16);\n  --wb-border-action: var(--wb-palette-blue-7);\n  --wb-border-teams: var(--wb-palette-cyan-3);\n  --wb-border-popover: color-mix(in srgb, var(--wb-palette-black-100) 6%, transparent);\n  --wb-border-popover-strong: color-mix(in srgb, var(--wb-palette-black-100) 24%, transparent);\n  --wb-border-control: var(--wb-palette-gray-4);\n  --wb-border-input: var(--wb-palette-gray-3);\n  --wb-border-warning: #ffe1a8;\n  --wb-border-error: #fecdca;\n  --wb-bg-warning-subtle: #fff8e6;\n  --wb-border-warning-subtle: #ffe1a8;\n  --wb-bg-error-subtle: #fef3f2;\n  --wb-border-error-subtle: #fecdca;\n  --wb-brand-bright: #4ecba0;\n  --wb-brand-soft: #a8d9c5;\n  --wb-bg-action: var(--wb-palette-blue-8);\n  --wb-text-action: var(--wb-palette-blue-8);\n  --wb-bg-info: #EFF6FF;\n  --wb-border-info: var(--wb-palette-blue-2);\n  --wb-bg-focus-soft: rgba(26, 121, 255, .1);\n  --wb-bg-row-selected: var(--wb-bg-item-selected);\n  --wb-text-link-default: #60a5fa;\n  --wb-accent-purple-light: var(--wb-palette-purple-4);\n  --wb-bg-purple: var(--wb-accent-purple-light);\n  --wb-bg-purple-light: var(--wb-palette-purple-2);\n  --wb-border-purple: var(--wb-palette-purple-3);\n  --wb-bg-inset-strong: var(--wb-palette-gray-3);\n  --wb-border-faint: var(--wb-palette-black-10);\n  --wb-border-mask: var(--wb-palette-black-10);\n  --wb-text-placeholder-soft: var(--wb-palette-black-30);\n  --wb-shadow-card-soft: 0 16px 32px -8px rgba(0, 0, 0, .03);\n  --wb-bg-card-hover: color-mix(in srgb, var(--wb-palette-black-100) 6%, var(--wb-bg-card));\n  --wb-bg-active-hover: #F7F8FA;\n  --wb-border-subtle-soft: #EFEFEF;\n  --wb-border-selected: #C9CDD4;\n  --wb-color-text-subtle: #777777;\n  --wb-todo-menu-bg-hover: var(--wb-palette-gray-4);\n  --wb-todo-menu-bg-active: var(--wb-palette-gray-5);\n  --wb-todo-menu-icon-default: var(--wb-palette-black-70);\n  --wb-todo-menu-text-default: var(--wb-palette-black-90);\n  --wb-todo-menu-text-heading: var(--wb-palette-black-30);\n  --wb-todo-menu-text-view-more: var(--wb-palette-black-50);\n  --wb-menu-item-danger-fg: #f14c4c;\n  --wb-icon-strong: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-icon-primary: var(--wb-palette-black-90);\n  --wb-icon-secondary: var(--wb-palette-black-70);\n  --wb-icon-medium: var(--wb-palette-black-70);\n  --wb-icon-tertiary: var(--wb-palette-black-50);\n  --wb-icon-muted: var(--wb-palette-black-30);\n  --wb-status-success: var(--wb-palette-green-8);\n  --wb-status-warning: var(--wb-palette-orange-8);\n  --wb-status-error: var(--wb-palette-red-8);\n  --wb-status-info: var(--wb-palette-brand-8);\n  --wb-status-warning-soft: var(--wb-palette-orange-1);\n  --wb-status-error-soft: var(--wb-palette-red-1);\n  --wb-sidebar-bg: var(--wb-color-bg-primary-default);\n  --wb-sidebar-border: var(--wb-color-bg-primary-hover);\n  --wb-sidebar-mask-end: var(--wb-sidebar-bg);\n  --wb-text-version-badge: var(--wb-palette-black-20);\n  --wb-text-enterprise: var(--wb-color-text-warning-default);\n  --wb-scrollbar-thumb: var(--wb-palette-black-20);\n  --wb-scrollbar-thumb-hover: var(--wb-palette-black-30);\n  --wb-scrollbar-thumb-bg: rgba(0, 0, 0, .12);\n  --wb-badge-warning-bg: var(--wb-status-warning-soft);\n  --wb-badge-warning-fg: var(--wb-color-text-warning-default);\n  --wb-badge-success-bg: var(--wb-palette-green-1);\n  --wb-badge-success-fg: var(--wb-color-text-success-active);\n  --wb-accent-unread: var(--wb-palette-brand-8);\n  --wb-bg-pill-active: rgba(0, 0, 0, .75);\n  --wb-bg-pill-active-hover: rgba(0, 0, 0, .82);\n  --wb-bg-pill-hover: #fafafa;\n  --wb-task-starter-trigger-bg-hover: #ebebeb;\n  --wb-quick-action-item-bg-hover: #ebebeb;\n  --wb-quick-action-item-border-hover: #e5e5e5;\n  --wb-home-composer-chip-bg-hover: #f2f2f2;\n  --wb-mode-selector-shadow: 0 8px 24px rgba(15, 23, 42, .1), 0 2px 6px rgba(15, 23, 42, .04);\n  --wb-text-connector: #FFFFFF;\n  --wb-connector-blue: #4F7DF3;\n  --wb-connector-blue-bg: #EAF2FF;\n  --wb-connector-green: #31A354;\n  --wb-connector-green-bg: #ECFDF3;\n  --wb-connector-amber: #F3B434;\n  --wb-connector-amber-bg: #FFF7E0;\n  --wb-connector-red: #E05243;\n  --wb-connector-red-bg: #FEF0EE;\n  --wb-connector-purple: #7B61FF;\n  --wb-connector-purple-bg: #F1EEFF;\n  --wb-connector-orange: #F97316;\n  --wb-connector-orange-bg: #FFF0E6;\n  --wb-connector-slate: #64748B;\n  --wb-connector-slate-bg: #F1F5F9;\n  --wb-connector-sky: #0EA5E9;\n  --wb-connector-sky-bg: #E8F7FF;\n  --wb-bg-connector-google-sheets: var(--wb-connector-blue);\n  --wb-bg-connector-google-drive: var(--wb-connector-amber);\n  --wb-bg-connector-notion: var(--wb-connector-purple);\n  --wb-bg-connector-google-docs: #6B7280;\n  --wb-bg-connector-linear: #6366F1;\n  --wb-bg-connector-github: var(--wb-connector-green);\n  --wb-bg-connector-gmail: var(--wb-connector-red);\n  --wb-bg-connector-slack: var(--wb-connector-orange);\n  --wb-bg-connector-figma: #F05A3A;\n  --wb-border-drag-indicator: var(--wb-palette-brand-8);\n  --wb-connector-detail-try-loading-bg: #CCCCCC;\n  --wb-connector-detail-surface-bg: #FAFAFA;\n  --wb-connector-detail-flow-dot-bg: #F2F2F2;\n  --wb-connector-token-input-placeholder: #C6C6C6;\n  --wb-toast-info-icon: #0052D9;\n  --wb-brand-wechat-green: #0BC160;\n  --wb-brand-wechat-green-hover: #07A152;\n  --wb-brand-wechat-green-connected: #07C160;\n  --wb-bg-overlay-elevated: rgba(60, 60, 64, .78);\n  --wb-bg-scrim-light: rgba(255, 255, 255, .8);\n  --wb-color-text-on-scrim-light: rgba(0, 0, 0, .42);\n  --wb-bg-warning-soft-strong: rgba(245, 158, 11, .16);\n  --wb-border-input-soft-dark: rgba(255, 255, 255, .38);\n  --wb-control-checkbox-selected-bg: var(--wb-palette-black-90);\n  --wb-control-checkbox-selected-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-control-checkbox-selected-fg: var(--wb-palette-white-100);\n  --wb-checkbox-bg-default: transparent;\n  --wb-checkbox-border-default: var(--wb-palette-black-20);\n  --wb-checkbox-border-hover: var(--wb-palette-black-50);\n  --wb-checkbox-bg-selected: var(--wb-palette-black-75);\n  --wb-checkbox-border-selected: var(--wb-palette-black-75);\n  --wb-checkbox-icon-selected: var(--wb-palette-gray-1);\n  --wb-bg-input-slot-gradient:\n    linear-gradient(\n      180deg,\n      #f0f0f0 0%,\n      #f5f5f5 100%);\n  --wb-bg-surface-overlay-soft: rgba(0, 0, 0, .04);\n  --wb-bg-surface-overlay-strong: rgba(0, 0, 0, .08);\n  --wb-text-faded: rgba(0, 0, 0, .35);\n  --wb-border-overlay: rgba(0, 0, 0, .38);\n  --wb-accent-link-soft: rgba(26, 121, 255, .14);\n  --wb-accent-link-soft-hover: rgba(64, 128, 255, .12);\n  --wb-icon-folder: #e89a2d;\n  --wb-status-info-blue: #60a5fa;\n  --wb-status-success-muted: #10b981;\n  --wb-status-warning-muted: #f59e0b;\n  --wb-status-success-soft-bg: rgba(16, 185, 129, .1);\n  --wb-status-warning-soft-bg: rgba(245, 158, 11, .1);\n  --wb-status-error-soft-bg: rgba(255, 77, 79, .1);\n  --wb-alert-success-bg: #d1fae5;\n  --wb-alert-success-text: #047857;\n  --wb-alert-info-bg: #dbeafe;\n  --wb-alert-info-text: var(--wb-palette-blue-8);\n  --wb-alert-warning-bg: #fef3c7;\n  --wb-alert-warning-text: #d97706;\n  --wb-alert-warning-bg-fc: #F9F1E8;\n  --wb-alert-warning-text-fc: #C04100;\n  --wb-alert-error-bg: #fef2f2;\n  --wb-alert-error-text: #dc2626;\n  --wb-badge-gold: #d4a017;\n  --wb-badge-gold-bg: #f0c040;\n  --wb-badge-gold-fg: #856404;\n  --wb-badge-pending-bg: #3d3d3d;\n  --wb-badge-pending-fg: var(--wb-palette-white-100);\n  --wb-bg-skeleton-highlight: rgba(128, 128, 128, .18);\n  --wb-onboarding-brand-bg-blue: #e8f0ff;\n  --wb-onboarding-brand-bg-green: #e8f8f1;\n  --wb-onboarding-arrow-default: #b8bcc6;\n  --wb-onboarding-arrow-active: #4ecba0;\n  --wb-onboarding-arrow-fade: #a8d9c5;\n  --wb-border-tooltip: #d1d5db;\n  --wb-bg-popover-picker: var(--wb-bg-popover);\n  --wb-banner-accent-bg: #fde68a;\n  --wb-tdoc-icon-bg: #e8f0ff;\n  --wb-switcher-bg: rgba(0, 0, 0, .06);\n  --wb-switcher-thumb-bg: #FFFFFF;\n  --wb-switcher-text: rgba(0, 0, 0, .7);\n  --wb-switcher-text-active: rgba(0, 0, 0, .88);\n  --wb-switcher-text-hover: rgba(0, 0, 0, .85);\n  --wb-tag-check-accent: #f7d18f;\n  --wb-tag-hot-gradient-start: #ff6b6b;\n  --wb-tag-hot-gradient-end: #ee5a24;\n  --wb-tag-operational-text: #393939;\n  --wb-scene-tag-bg: rgba(0, 0, 0, .9);\n  --wb-scene-tag-fg: #fff;\n  --wb-scene-tag-bg-hover: rgba(0, 0, 0, 1);\n  --wb-scene-tag-grey-bg: rgba(0, 0, 0, .1);\n  --wb-scene-tag-grey-fg: var(--wb-palette-black-90);\n  --wb-scene-tag-grey-bg-hover: var(--wb-color-bg-primary-hover);\n  --wb-tag-skill-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 10%, transparent);\n  --wb-tag-skill-bg-hover-dark: rgba(255, 255, 255, .14);\n  --wb-home-composer-card-bg: var(--wb-palette-gray-1);\n  --wb-home-composer-sub-card-bg: var(--wb-palette-gray-3);\n  --wb-home-composer-arrow-fg: #494949;\n  --wb-quick-actions-fade-bg: var(--wb-palette-gray-1);\n  --wb-apps-toggle-color: rgba(0, 0, 0, .25);\n  --wb-apps-toggle-color-hover: rgba(0, 0, 0, .45);\n  --wb-apps-toggle-line-dark: rgba(255, 255, 255, .08);\n  --wb-apps-toggle-line-dark-hover: rgba(255, 255, 255, .15);\n  --wb-activity-card-border: rgba(15, 23, 42, .05);\n  --wb-activity-card-shadow: 0 18px 44px rgba(15, 23, 42, .1);\n  --wb-activity-card-close-default: rgba(31, 41, 55, .35);\n  --wb-activity-card-close-hover: rgba(31, 41, 55, .65);\n  --wb-activity-card-action-fg: rgba(255, 255, 255, .9);\n  --wb-activity-card-dark-bg: #2A2D3A;\n  --wb-mode-selector-label: #979797;\n  --wb-mode-switch-bg: #E8E8E8;\n  --wb-mode-btn-text: #666;\n  --wb-mode-btn-active-bg: #000;\n  --wb-mode-btn-active-fg: #fff;\n  --wb-mode-btn-hover-bg: rgba(0, 0, 0, .08);\n  --wb-mode-tag-fg: #fff;\n  --wb-quick-action-arrow-bg: #f0f0f0;\n  --wb-quick-action-selected-bg: #6C4DFF;\n  --wb-quick-action-selected-fg: var(--wb-palette-white-100);\n  --wb-quick-action-sub-item-hover-bg: rgba(0, 0, 0, .06);\n  --wb-dropdown-bg-color: var(--wb-bg-popover);\n  --wb-dropdown-item-hover-bg-color: var(--wb-bg-hover-light);\n  --wb-dropdown-border-color: var(--wb-border-default);\n  --wb-question-floating-card-bg: var(--wb-bg-card);\n  --wb-question-floating-card-border: var(--wb-border-default);\n  --wb-question-floating-card-shadow: 0px 16px 32px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-question-floating-hover-bg: var(--wb-bg-hover);\n  --wb-question-floating-number-active-bg: var(--wb-palette-white-100);\n  --wb-question-floating-number-bg: var(--wb-palette-gray-3);\n  --wb-model-tip-bg: rgba(0, 0, 0, .7);\n  --wb-model-tip-text-color: rgba(255, 255, 255, .9);\n  --wb-tab-active-border: var(--wb-palette-purple-2);\n  --wb-tab-active-fg: var(--wb-palette-purple-5);\n  --wb-tab-gradient-light:\n    linear-gradient(\n      90deg,\n      #f5f0ff,\n      #fef8e8);\n  --wb-avatar-bg-accent: var(--wb-palette-cyan-2);\n  --wb-avatar-bg-fallback-1: #6366f1;\n  --wb-avatar-bg-fallback-2: #8b5cf6;\n  --wb-avatar-bg-fallback-3: #ec4899;\n  --wb-avatar-bg-fallback-4: #f59e0b;\n  --wb-avatar-bg-fallback-5: #10b981;\n  --wb-avatar-bg-fallback-6: #14b8a6;\n  --wb-avatar-bg-fallback-7: #06b6d4;\n  --wb-avatar-bg-fallback-8: #3b82f6;\n  --wb-favorite-bg-soft: rgba(239, 68, 68, .06);\n  --wb-favorite-btn-bg: rgba(255, 255, 255, .85);\n  --wb-discover-text-expert: var(--wb-accent-violet);\n  --wb-discover-bg-expert-soft: var(--wb-accent-violet-soft);\n  --wb-discover-text-mcp: var(--wb-accent-cyan);\n  --wb-discover-bg-mcp-soft: var(--wb-accent-cyan-soft);\n  --wb-accent-purple: var(--wb-palette-purple-8);\n  --wb-accent-purple-soft: color-mix(in srgb, var(--wb-palette-purple-8) 8%, transparent);\n  --wb-accent-blue: var(--wb-palette-blue-5);\n  --wb-accent-blue-soft: color-mix(in srgb, var(--wb-palette-blue-5) 8%, transparent);\n  --wb-accent-pink: #ec4899;\n  --wb-accent-pink-soft: rgba(236, 72, 153, .08);\n  --wb-accent-teal: var(--wb-palette-cyan-6);\n  --wb-accent-teal-soft: color-mix(in srgb, var(--wb-palette-cyan-6) 8%, transparent);\n  --wb-accent-orange: #f5a623;\n  --wb-accent-orange-soft: rgba(245, 166, 35, .08);\n  --wb-card-selected-bg: #f9fafb;\n  --wb-card-selected-border: #e5e7eb;\n  --wb-claw-text-wecom: #1565c0;\n  --wb-claw-text-feishu: var(--wb-palette-cyan-7);\n  --wb-claw-text-qq: #7b1fa2;\n  --wb-claw-text-dingtalk: #e65100;\n  --wb-claw-text-wechat: #2e7d32;\n  --wb-claw-text-yuanbao: #f57f17;\n  --wb-claw-text-link: #4a90d9;\n  --wb-claw-text-link-hover: #2a6cb8;\n  --wb-share-bar-bg: var(--wb-bg-card);\n  --wb-check-checkmark: var(--wb-palette-white-100);\n  --wb-color-bg-modal: var(--wb-bg-modal);\n  --wb-color-bg-input: rgba(0, 0, 0, .04);\n  --wb-color-mask-strong: rgba(0, 0, 0, .8);\n  --wb-netdrive-text-primary: #333333;\n  --wb-netdrive-text-secondary: #666666;\n  --wb-netdrive-border: #d1d5db;\n  --wb-netdrive-error-fg: #cf222e;\n  --wb-netdrive-text-disabled: rgba(26, 26, 26, .6);\n  --wb-voice-input-card-bg: var(--wb-bg-card);\n  --wb-voice-input-card-border: #d1d5db;\n  --wb-voice-input-text-primary: var(--wb-color-text-primary);\n  --wb-voice-input-text-secondary: #666666;\n  --wb-voice-input-guide-link: #0078d4;\n  --wb-voice-input-hover-bg: var(--wb-bg-hover);\n  --wb-voice-input-btn-primary-bg: #0078d4;\n  --wb-voice-input-btn-primary-fg: var(--wb-palette-white-100);\n  --wb-voice-input-pill-bg: var(--wb-palette-gray-2);\n  --wb-voice-input-confirm: #00c29a;\n  --wb-main-area-background: var(--wb-bg-primary);\n  --wb-main-area-border-color: var(--wb-border-subtle);\n  --wb-main-area-box-shadow: 0px 12px 24px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-ring-bg-track: rgba(0, 0, 0, .2);\n  --wb-ring-bg-progress: rgba(0, 0, 0, .7);\n  --wb-input-button-text: rgba(0, 0, 0, .9);\n  --wb-file-op-pdf: #E57163;\n  --wb-file-op-code: #5A8AA4;\n  --wb-file-op-word: #528AE3;\n  --wb-file-op-presentation: #D24F31;\n  --wb-file-op-spreadsheet: #51A776;\n  --wb-status-neutral: #94a3b8;\n  --wb-status-neutral-soft-bg: rgba(148, 163, 184, .12);\n  --wb-status-info-blue-soft-bg: rgba(96, 165, 250, .08);\n  --wb-modify-marker-bg: rgba(255, 187, 0, .15);\n  --wb-code-syntax-keyword: var(--wb-palette-blue-10);\n  --wb-code-syntax-string: #0a3069;\n  --wb-code-syntax-error: #cf222e;\n  --wb-code-syntax-number: #953800;\n  --wb-code-syntax-function: #8250df;\n  --wb-code-border-input: color-mix(in srgb, #d0d7de 20%, transparent);\n  --wb-accent-violet: var(--wb-palette-purple-6);\n  --wb-accent-cyan: var(--wb-palette-cyan-5);\n  --wb-accent-violet-soft: color-mix(in srgb, var(--wb-palette-purple-6) 6%, transparent);\n  --wb-accent-cyan-soft: color-mix(in srgb, var(--wb-palette-cyan-5) 6%, transparent);\n  --wb-palette-green-vivid: #16A34A;\n  --wb-palette-amber-vivid: #CA8A04;\n  --wb-palette-red-vivid: #DC2626;\n  --wb-palette-success-vivid: var(--wb-palette-green-vivid);\n  --wb-palette-warning-vivid: var(--wb-palette-amber-vivid);\n  --wb-palette-error-vivid: var(--wb-palette-red-vivid);\n  --wb-status-success-vivid: var(--wb-palette-green-vivid);\n  --wb-status-warning-vivid: var(--wb-palette-amber-vivid);\n  --wb-status-error-vivid: var(--wb-palette-red-vivid);\n  --wb-bg-blue-soft: rgba(74, 144, 217, .04);\n  --wb-bg-green-soft: rgba(52, 168, 83, .08);\n  --wb-badge-doc: #4285f4;\n  --wb-badge-sheet: #34a853;\n  --wb-badge-img: #f9ab00;\n  --wb-avatar-bg: rgb(96, 125, 139);\n  --wb-text-author: rgb(107, 114, 128);\n  --wb-bg-overlay-dropzone: rgba(30, 30, 46, .7);\n  --wb-bg-card-action: rgba(30, 30, 46, .9);\n  --wb-bg-error-hover: rgba(234, 67, 53, .12);\n  --wb-bg-error-hover-dark: rgba(239, 83, 80, .1);\n  --wb-bg-success-soft-dark: rgba(76, 175, 80, .15);\n  --wb-bg-success-vivid-soft: color-mix(in srgb, var(--wb-palette-success-vivid) 10%, transparent);\n  --wb-bg-warning-vivid-soft: color-mix(in srgb, var(--wb-palette-warning-vivid) 10%, transparent);\n  --wb-bg-error-vivid-soft: color-mix(in srgb, var(--wb-palette-error-vivid) 10%, transparent);\n  --wb-bg-error-vivid-subtle: color-mix(in srgb, var(--wb-palette-error-vivid) 8%, transparent);\n  --wb-border-error-vivid-subtle: color-mix(in srgb, var(--wb-palette-error-vivid) 20%, transparent);\n  --wb-bg-favorite-soft: rgba(239, 68, 68, .08);\n  --wb-text-danger: var(--wb-palette-error-vivid);\n  --wb-activity-blue-10: rgba(59, 130, 246, .1);\n  --wb-activity-green-25: rgba(34, 197, 94, .25);\n  --wb-activity-green-15: rgba(34, 197, 94, .15);\n  --wb-activity-blue-15: rgba(59, 130, 246, .15);\n  --wb-activity-green-40: rgba(34, 197, 94, .4);\n  --wb-activity-green-20: rgba(34, 197, 94, .2);\n  --wb-bg-overlay-on-dark: rgba(255, 255, 255, .05);\n  --wb-bg-badge-on-image: rgba(0, 0, 0, .24);\n  --wb-bg-badge-on-image-hover: rgba(0, 0, 0, .36);\n  --wb-dropdown-bg-color-fc: #2d2d2d;\n  --wb-question-floating-card-shadow-fc: 0px 12px 24px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-spacing-0: 0;\n  --wb-spacing-1: 2px;\n  --wb-spacing-2: 4px;\n  --wb-spacing-2-5: 5px;\n  --wb-spacing-3: 8px;\n  --wb-spacing-4: 12px;\n  --wb-spacing-5: 16px;\n  --wb-spacing-6: 20px;\n  --wb-spacing-7: 24px;\n  --wb-spacing-8: 32px;\n  --wb-spacing-9: 40px;\n  --wb-spacing-10: 48px;\n  --wb-radius-none: 0;\n  --wb-radius-xs: 2px;\n  --wb-radius-sm: 4px;\n  --wb-radius-md: 6px;\n  --wb-radius-lg: 8px;\n  --wb-radius-xl: 12px;\n  --wb-radius-2xl: 16px;\n  --wb-radius-3xl: 20px;\n  --wb-radius-4xl: 24px;\n  --wb-font-code-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    monospace;\n  --wb-font-mono: var(--wb-font-code-family);\n  --wb-font-display-size: 32px;\n  --wb-font-display-line-height: 40px;\n  --wb-font-display-weight: 700;\n  --wb-font-h1-size: 24px;\n  --wb-font-h1-line-height: 32px;\n  --wb-font-h1-weight: 600;\n  --wb-font-h2-size: 20px;\n  --wb-font-h2-line-height: 28px;\n  --wb-font-h2-weight: 600;\n  --wb-font-h3-size: 16px;\n  --wb-font-h3-line-height: 24px;\n  --wb-font-h3-weight: 600;\n  --wb-font-body-size: 14px;\n  --wb-font-body-line-height: 22px;\n  --wb-font-body-weight: 400;\n  --wb-font-body-strong-size: 14px;\n  --wb-font-body-strong-line-height: 22px;\n  --wb-font-body-strong-weight: 600;\n  --wb-font-caption-size: 12px;\n  --wb-font-caption-line-height: 18px;\n  --wb-font-caption-weight: 400;\n  --wb-font-code-size: 13px;\n  --wb-font-code-line-height: 20px;\n  --wb-shadow-none: none;\n  --wb-shadow-sm: 0 1px 2px color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-shadow-md: 0 2px 8px color-mix(in srgb, var(--wb-palette-black-100) 12%, transparent);\n  --wb-shadow-lg: 0 4px 16px color-mix(in srgb, var(--wb-palette-black-100) 16%, transparent);\n  --wb-shadow-xl: 0 8px 32px color-mix(in srgb, var(--wb-palette-black-100) 20%, transparent);\n  --wb-shadow-popover: 0 4px 12px -4px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent), 0 3px 6px -8px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent);\n  --wb-shadow-dropdown:\n    0 4px 6px -1px rgba(0, 0, 0, .1),\n    0 2px 4px -1px rgba(0, 0, 0, .06),\n    0 12px 28px rgba(0, 0, 0, .15);\n  --wb-shadow-dialog: 0px 8px 48px 0px rgba(0, 0, 0, .08), 0px 6px 12px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-input: 0 12px 24px -8px color-mix(in srgb, var(--wb-palette-black-100) 2%, transparent), 0 2px 4px -4px color-mix(in srgb, var(--wb-palette-black-100) 2%, transparent);\n  --wb-shadow-selection-quote-popup: 0px 4px 12px 0px rgba(0, 0, 0, .04), 0px 3px 6px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-medium: 0 12px 32px rgba(0, 0, 0, .1);\n  --wb-shadow-heavy: 0 20px 60px rgba(0, 0, 0, .15);\n  --wb-shadow-focus-ring: 0 0 0 2px rgba(26, 121, 255, .1);\n  --wb-shadow-card-hover: 0 8px 20px rgba(0, 0, 0, .12);\n  --wb-shadow-input-card: inset 0 -1px 0 rgba(0, 0, 0, .04);\n  --wb-shadow-dialog-md: 0 8px 24px rgba(0, 0, 0, .08);\n  --wb-shadow-tooltip: 0 4px 12px rgba(0, 0, 0, .16);\n  --wb-shadow-message-toolbar: 0px 6px 24px 0px rgba(0, 0, 0, .04), 0px 4px 6px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-large: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);\n  --wb-shadow-card: 0 1px 2px rgba(0, 0, 0, .04);\n  --wb-shadow-elevated: 0 8px 24px rgba(15, 23, 42, .1);\n  --wb-shadow-focus-blue: 0 0 0 2px rgba(74, 144, 217, .15);\n  --wb-shadow-error: 0 4px 12px rgba(244, 67, 54, .3);\n  --wb-shadow-drawer: -4px -2px 16px rgba(0, 0, 0, .06), 0 0 0 1px rgba(0, 0, 0, .03);\n  --wb-motion-duration-fast: .12s;\n  --wb-motion-duration-sm: .15s;\n  --wb-motion-duration-base: .2s;\n  --wb-motion-duration-slow: .32s;\n  --wb-motion-easing-standard: cubic-bezier(.4, 0, .2, 1);\n  --wb-size-control-sm: 24px;\n  --wb-size-control-md: 32px;\n  --wb-size-control-lg: 40px;\n  --wb-icon-size-sm: 12px;\n  --wb-icon-size-md: 16px;\n  --wb-icon-size-lg: 20px;\n  --wb-colleagues-layer-chat-float: 900;\n  --wb-colleagues-layer-chat-menu: 2;\n  --wb-colleagues-layer-dialog: 1200;\n  --wb-colleagues-layer-dialog-popover: 1205;\n  --wb-colleagues-layer-dialog-local-modal: 1208;\n  --wb-colleagues-layer-dialog-hire: 1210;\n  --wb-colleagues-layer-dialog-tdocs: 1220;\n  --wb-colleagues-layer-dialog-bind-channel: 1230;\n  --wb-colleagues-layer-dialog-publish: 1240;\n  --wb-colleagues-layer-promo: 1400;\n  --wb-colleagues-layer-promo-loading: 1410;\n  --wb-colleagues-layer-confirm: 1500;\n  --wb-button-height-medium: 32px;\n  --wb-button-height-small: 24px;\n  --wb-button-height-large: 48px;\n  --wb-button-min-width-medium: 68px;\n  --wb-button-min-width-small: 40px;\n  --wb-button-padding-medium: var(--wb-spacing-4);\n  --wb-button-padding-small: var(--wb-spacing-3);\n  --wb-button-padding-large: var(--wb-spacing-8);\n  --wb-button-gap-medium: var(--wb-spacing-2);\n  --wb-button-gap-small: var(--wb-spacing-1);\n  --wb-button-gap-large: var(--wb-spacing-3);\n  --wb-button-font-size-medium: 14px;\n  --wb-button-font-size-small: 12px;\n  --wb-button-font-size-large: 14px;\n  --wb-button-line-height-medium: 22px;\n  --wb-button-line-height-small: 20px;\n  --wb-button-line-height-large: 22px;\n  --wb-button-border-radius-medium: var(--wb-radius-lg);\n  --wb-button-border-radius-small: var(--wb-radius-md);\n  --wb-button-border-radius-large: var(--wb-radius-xl);\n  --wb-button-icon-size-medium: 16px;\n  --wb-button-primary-bg: var(--wb-palette-black-90);\n  --wb-button-primary-bg-hover: var(--wb-palette-black-75);\n  --wb-button-primary-bg-active: var(--wb-palette-black-75);\n  --wb-button-primary-bg-disabled: var(--wb-palette-black-20);\n  --wb-button-primary-fg: var(--wb-palette-white-100);\n  --wb-button-primary-fg-disabled: var(--wb-palette-white-100);\n  --wb-button-secondary-bg: var(--wb-palette-white-100);\n  --wb-button-secondary-bg-hover: var(--wb-palette-gray-2);\n  --wb-button-secondary-bg-active: var(--wb-palette-gray-2);\n  --wb-button-secondary-bg-disabled: var(--wb-palette-gray-2);\n  --wb-button-secondary-fg: var(--wb-palette-black-90);\n  --wb-button-secondary-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-secondary-border: #DEDEDE;\n  --wb-button-grey-bg: var(--wb-palette-gray-4);\n  --wb-button-grey-bg-hover: var(--wb-palette-gray-5);\n  --wb-button-grey-bg-active: var(--wb-palette-gray-5);\n  --wb-button-grey-bg-disabled: var(--wb-palette-gray-4);\n  --wb-button-grey-fg: var(--wb-palette-black-90);\n  --wb-button-grey-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-ghost-bg: transparent;\n  --wb-button-ghost-bg-hover: rgba(0, 0, 0, .06);\n  --wb-button-ghost-bg-active: rgba(0, 0, 0, .06);\n  --wb-button-ghost-fg: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-hover: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-active: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-link-bg: transparent;\n  --wb-button-link-bg-hover: transparent;\n  --wb-button-link-bg-active: transparent;\n  --wb-button-link-bg-disabled: transparent;\n  --wb-button-link-fg: #1470B4;\n  --wb-button-link-fg-hover: #1470B4;\n  --wb-button-link-fg-disabled: #94B7D1;\n  --wb-button-danger-bg: var(--wb-palette-red-7);\n  --wb-button-danger-bg-hover: var(--wb-palette-red-6);\n  --wb-button-danger-bg-active: var(--wb-palette-red-6);\n  --wb-button-danger-bg-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-fg-on-solid: var(--wb-palette-white-100);\n  --wb-button-danger-fg-on-solid-disabled: var(--wb-palette-white-100);\n  --wb-button-danger-fg: var(--wb-palette-red-8);\n  --wb-button-danger-fg-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-border: var(--wb-palette-red-8);\n  --wb-button-danger-border-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-bg-soft-hover: color-mix(in srgb, var(--wb-color-text-error-default) 8%, transparent);\n  --wb-button-danger-bg-soft-active: color-mix(in srgb, var(--wb-color-text-error-default) 16%, transparent);\n  --wb-button-loading-primary-fg: var(--wb-palette-white-100);\n  --wb-button-loading-secondary-fg: var(--wb-palette-black-100);\n  --wb-button-loading-grey-fg: var(--wb-palette-black-100);\n  --wb-button-loading-ghost-fg: var(--wb-palette-black-100);\n  --wb-button-loading-link-fg: #1470B4;\n  --wb-button-loading-danger-fg-on-solid: var(--wb-palette-white-100);\n  --wb-button-loading-danger-fg: var(--wb-color-text-error-disabled);\n  --wb-button-success-bg: #0CBF5B;\n  --wb-button-success-bg-hover: #09a84f;\n  --wb-button-login-bg: #1a1a1a;\n  --wb-button-login-bg-hover: var(--wb-palette-black-100);\n  --wb-button-login-bg-active: var(--wb-palette-black-100);\n  --wb-button-inverse-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-button-inverse-bg-active: color-mix(in srgb, var(--wb-palette-black-100) 80%, transparent);\n  --wb-button-inverse-fg-disabled: var(--wb-palette-white-60);\n  --wb-button-confirm-bg: var(--wb-palette-black-90);\n  --wb-button-cancel-bg: var(--wb-palette-gray-4);\n  --wb-button-soft-bg: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-button-soft-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 12%, transparent);\n  --wb-button-secondaryfill-bg-hover: #f0f0f0;\n  --wb-button-secondary-fg-hover: var(--wb-palette-black-100);\n  --wb-modal-width: 100%;\n  --wb-modal-max-height: calc(100vh - 160px) ;\n  --wb-modal-max-width-s: 480px;\n  --wb-modal-max-width-m: 640px;\n  --wb-modal-max-width-ml: 640px;\n  --cb-text-primary: var(--wb-color-text-primary);\n  --cb-text-secondary: var(--wb-color-text-secondary);\n  --cb-text-tertiary: var(--wb-color-text-tertiary);\n  --cb-text-disabled: var(--wb-color-text-disabled);\n  --cb-text-solid: var(--wb-color-text-solid);\n  --cb-text-error-active: var(--wb-color-text-error-active);\n  --cb-toast-info-color: var(--wb-toast-info-icon);\n  --cb-text-link: var(--wb-color-text-link-default);\n  --cb-text-link-hover: var(--wb-color-text-link-hover);\n  --cb-bg-primary-default: var(--wb-color-bg-primary-default);\n  --cb-bg-primary-hover: var(--wb-color-bg-primary-hover);\n  --cb-bg-primary-active: var(--wb-color-bg-primary-hover-strong);\n  --cb-dialog-mask: var(--wb-palette-black-60);\n  --cb-panel-bg-primary: var(--wb-bg-primary);\n  --cb-sidebar-bg: var(--wb-sidebar-bg);\n  --cb-text-quaternary: var(--wb-color-text-disabled);\n  --cb-border-secondary: var(--wb-color-border-secondary);\n  --cb-border-drag-indicator: var(--wb-border-drag-indicator);\n  --cb-shadow-popover: var(--wb-shadow-popover);\n  --cb-shadow-message-toolbar: var(--wb-shadow-popover);\n  --cb-shadow-popover-fc: var(--wb-shadow-popover);\n  --cb-scrollbar-thumb: var(--wb-scrollbar-thumb);\n  --cb-scrollbar-thumb-hover: var(--wb-scrollbar-thumb-hover);\n  --cb-popover-bg-color: var(--wb-bg-primary);\n  --cb-popover-background: var(--wb-bg-primary);\n  --cb-popover-border: var(--wb-color-border-primary);\n  --cb-popover-divider: var(--wb-border-popover);\n  --cb-popover-divider-fc: var(--wb-color-border-tertiary);\n  --cb-popover-border-fc: var(--wb-color-border-primary);\n  --cb-popover-bg: var(--wb-bg-primary);\n  --cb-dropdown-item-hover-bg-color: var(--wb-color-bg-primary-hover-strong);\n  --cb-hover-bg: var(--wb-bg-hover);\n  --cb-icon-button-hover-background: var(--wb-bg-hover);\n  --cb-popover-bg-fc: var(--wb-bg-primary);\n  --cb-popover-bg-color-fc: var(--wb-bg-primary);\n  --cb-popover-background-fc: var(--wb-bg-primary);\n  --cb-hover-bg-fc: var(--wb-bg-hover);\n  --cb-icon-button-hover-background-fc: var(--wb-bg-hover);\n  --cb-popover-active-background: var(--wb-color-bg-primary-hover-strong);\n  --cb-list-item-active-bg: var(--wb-color-bg-primary-hover-strong);\n  --cb-list-item-selected-bg: var(--wb-palette-gray-2);\n  --cb-list-item-selected-foreground: var(--wb-color-text-primary);\n  --cb-search-input-bg: var(--wb-bg-secondary, #F7F7F7);\n  --cb-main-area-background: var(--wb-bg-primary);\n  --cb-green-color: var(--wb-brand-primary);\n  --cb-switch-active-bg: var(--wb-brand-primary);\n  --cb-switch-bg: var(--wb-palette-gray-5);\n  --cb-success-color: var(--wb-brand-primary);\n  --cb-error-color: var(--wb-color-text-error-default);\n  --cb-toggle-track-off-bg: var(--wb-bg-hover);\n  --cb-switch-thumb-bg: var(--wb-palette-white-100);\n  --cb-text-muted: var(--wb-color-text-disabled);\n  --cb-link-foreground: var(--wb-color-text-link-default);\n  --cb-input-active-border: var(--cb-green-color);\n  --cb-voice-pill-bg: var(--wb-palette-gray-2);\n  --cb-voice-text: var(--wb-color-text-secondary);\n  --cb-voice-confirm-color: var(--wb-brand-primary);\n  --cb-voice-mic-hover-bg: var(--wb-color-bg-primary-hover-strong);\n  --cb-button-grey-bg: var(--wb-button-grey-bg);\n  --cb-button-grey-fg: var(--wb-button-grey-fg);\n  --cb-avatar-fallback-bg: var(--wb-color-border-secondary);\n  --cb-avatar-fallback-fg: var(--wb-color-text-tertiary);\n  --cb-main-area-border-color: var(--wb-main-area-border-color);\n  --cb-main-area-box-shadow: var(--wb-main-area-box-shadow);\n  --chat-input-area-header-font-color: var(--wb-color-text-primary);\n  --cb-input-button-foreground: var(--wb-input-button-text);\n  --cb-dropdown-bg-color: var(--wb-dropdown-bg-color);\n  --cb-dropdown-border-color: var(--wb-dropdown-border-color);\n  --cb-question-floating-text-secondary: var(--wb-color-text-solid);\n  --cb-model-tip-bg: var(--wb-model-tip-bg);\n  --cb-model-tip-text-color: var(--wb-model-tip-text-color);\n  --cb-question-floating-card-border: var(--wb-color-border-secondary);\n  --cb-ring-progress: var(--wb-ring-bg-progress);\n  --cb-ring-track: var(--wb-ring-bg-track);\n  --cb-dialog-bg: var(--wb-bg-popover);\n  --cb-dialog-mask-bg: var(--wb-color-mask-color);\n  --cb-dialog-shadow: var(--wb-shadow-dialog-md);\n  --cb-dialog-content-bg: var(--wb-bg-active);\n  --cb-dialog-title-color: var(--wb-text-strong);\n  --cb-dialog-hint-color: var(--wb-text-strong);\n  --cb-dialog-warning-color: var(--wb-color-text-warning-default);\n  --cb-dialog-close-color: var(--wb-text-weak);\n  --cb-dialog-close-hover-bg: var(--wb-bg-card-strong);\n  --cb-qrcode-surface-bg: var(--wb-bg-popover);\n  --cb-spinner-track: var(--wb-color-border-secondary);\n  --cb-spinner-active: var(--wb-brand-bright);\n  --cb-dialog-btn-secondary-bg: var(--wb-bg-active);\n  --cb-dialog-btn-secondary-text: var(--wb-button-secondary-fg);\n  --cb-dialog-btn-secondary-hover-bg: var(--wb-bg-tertiary);\n  --cb-dialog-btn-primary-bg: var(--wb-button-primary-bg);\n  --cb-dialog-btn-primary-text: var(--wb-button-primary-fg);\n  --cb-dropdown-item-selected-bg-color: var(--wb-bg-hover);\n  --cb-palette-gray-2: var(--wb-palette-gray-2);\n  --cb-palette-gray-3: var(--wb-palette-gray-3);\n  --cb-palette-gray-4: var(--wb-palette-gray-4);\n  --cb-scene-tag-bg: var(--wb-palette-brand-2);\n  --cb-scene-tag-fg: var(--wb-color-text-primary);\n  --cb-border-default: var(--wb-color-border-primary);\n  --cb-font-size-offset: clamp(-1, var(--cb-font-size-offset-global, 0), 2);\n  --cb-task-icon-completed: var(--wb-color-text-disabled);\n  --cb-task-icon-waiting: var(--wb-icon-secondary);\n  --cb-task-completed-text: var(--wb-color-text-disabled, rgba(255, 255, 255, .25));\n  --wb-checkin-bg:\n    linear-gradient(\n      180deg,\n      #0DC7A4 0%,\n      #4DE49E 100%);\n  --wb-checkin-header-fg: #ffffff;\n  --wb-checkin-header-icon: #ffffff;\n  --wb-checkin-period-tag-bg: rgba(255, 255, 255, .5);\n  --wb-checkin-period-tag-fg: #008e70;\n  --wb-checkin-info-bg: #ffffff;\n  --wb-checkin-divider: #f2f2f2;\n  --wb-checkin-tomorrow-bg: #d6f0e2;\n  --wb-checkin-tomorrow-fg: #2a8a66;\n  --wb-checkin-pop-flash: #4ecba0;\n  --wb-checkin-btn-primary-bg: rgba(0, 0, 0, .75);\n  --wb-checkin-btn-primary-bg-hover: rgba(0, 0, 0, .85);\n  --wb-checkin-btn-primary-fg: #ffffff;\n  --wb-checkin-btn-primary-border: transparent;\n  --wb-checkin-btn-primary-bg-disabled: rgba(0, 0, 0, .05);\n  --wb-checkin-btn-primary-fg-disabled: rgba(0, 0, 0, .3);\n  --wb-checkin-btn-primary-border-disabled: transparent;\n  --wb-checkin-btn-success-bg: #10a37f;\n  --wb-checkin-btn-success-border: #10a37f;\n  --wb-checkin-btn-success-fg: #ffffff;\n  --wb-checkin-btn-secondary-bg: transparent;\n  --wb-checkin-btn-secondary-fg: rgba(0, 0, 0, .9);\n  --wb-checkin-btn-secondary-border: #e6e6e6;\n  --wb-checkin-btn-secondary-bg-hover: rgba(0, 0, 0, .04);\n  --ec-bg-primary: #ffffff;\n  --ec-bg-secondary: #fafafa;\n  --ec-bg-tertiary: #f5f5f5;\n  --ec-bg-hover: #f0f0f0;\n  --ec-bg-active: #f5f5f5;\n  --ec-text-primary: #1a1a1a;\n  --ec-text-secondary: #666666;\n  --ec-text-tertiary: #999999;\n  --ec-text-placeholder: #cccccc;\n  --ec-text-desc: var(--wb-color-text-secondary);\n  --ec-text-usage: var(--wb-color-text-tertiary);\n  --ec-text-use-count: var(--wb-color-text-secondary);\n  --ec-text-category-tab: var(--wb-color-text-secondary);\n  --ec-text-contrast: var(--wb-button-primary-fg);\n  --ec-text-soft: var(--wb-color-text-secondary);\n  --ec-text-strong: var(--wb-color-text-primary);\n  --ec-text-muted: var(--wb-text-muted);\n  --ec-expert-card-bg: #ffffff;\n  --ec-expert-card-hover-bg: #f0f0f0;\n  --ec-expert-card-hover-border: rgba(0, 0, 0, .08);\n  --ec-expert-card-avatar-bg: #a6d5da;\n  --ec-expert-card-shadow: 0 16px 32px rgba(0, 0, 0, .03);\n  --ec-expert-card-desc-color: rgba(0, 0, 0, .7);\n  --ec-card-tag-bg: rgba(0, 0, 0, .04);\n  --ec-card-tag-border: transparent;\n  --ec-card-tag-color: rgba(0, 0, 0, .7);\n  --ec-filter-border: transparent;\n  --ec-filter-text: var(--ec-text-category-tab);\n  --ec-filter-text-hover: var(--ec-text-secondary);\n  --ec-filter-text-active: var(--ec-text-primary);\n  --ec-primary: #1f1f1f;\n  --ec-primary-light: #f5f5f5;\n  --ec-primary-hover: #000000;\n  --ec-primary-shadow: rgba(0, 0, 0, .12);\n  --ec-primary-bg: #f5f2ff;\n  --ec-border: #e8e8e8;\n  --ec-border-light: var(--wb-border-default);\n  --ec-border-hover: var(--wb-border-strong);\n  --ec-border-subtle: var(--wb-border-default);\n  --ec-card-bg: #ffffff;\n  --ec-modal-bg: var(--wb-bg-popover);\n  --ec-card-border-static: #f0f0f0;\n  --ec-card-shadow: 0 1px 3px rgba(0, 0, 0, .06);\n  --ec-card-shadow-hover: 0 12px 32px rgba(0, 0, 0, .12);\n  --ec-card-border-hover: var(--wb-border-strong);\n  --ec-shadow-sm: var(--wb-shadow-dialog-md);\n  --ec-shadow-lg: var(--wb-shadow-dialog-md);\n  --ec-btn-gradient:\n    linear-gradient(\n      135deg,\n      #2f2f2f,\n      #111111);\n  --ec-btn-text: #ffffff;\n  --ec-btn-bg: var(--wb-button-primary-bg);\n  --ec-btn-bg-hover: var(--wb-button-primary-bg-hover);\n  --ec-surface-muted: var(--wb-bg-secondary);\n  --ec-surface-subtle: var(--wb-bg-primary);\n  --ec-surface-hover: var(--wb-bg-hover);\n  --ec-modal-tag-chip-bg: rgba(0, 0, 0, .02);\n  --ec-modal-tag-chip-color: rgba(0, 0, 0, .62);\n  --ec-modal-tag-chip-border: rgba(0, 0, 0, .06);\n  --ec-modal-quick-prompt-bg: rgba(0, 0, 0, .02);\n  --ec-modal-quick-prompt-bg-hover: rgba(0, 0, 0, .04);\n  --ec-modal-quick-prompt-color: rgba(0, 0, 0, .62);\n  --ec-modal-quick-prompt-border: rgba(0, 0, 0, .06);\n  --ec-success: #10b981;\n  --ec-warning: #f59e0b;\n  --ec-error: #ff4d4f;\n  --ec-avatar-fallback-bg-1: #6366f1;\n  --ec-avatar-fallback-bg-2: #8b5cf6;\n  --ec-avatar-fallback-bg-3: #ec4899;\n  --ec-avatar-fallback-bg-4: #f59e0b;\n  --ec-avatar-fallback-bg-5: #10b981;\n  --ec-avatar-fallback-bg-6: #3b82f6;\n  --ec-avatar-fallback-bg-7: #ef4444;\n  --ec-avatar-fallback-bg-8: #14b8a6;\n  --ec-operational-tag-bg: rgba(0, 0, 0, .05);\n  --ec-operational-tag-color: #393939;\n  --ec-operational-tag-border: transparent;\n  --ec-operational-tag-icon-color: #3d3d3d;\n  --ec-featured-scene-area-bg: #fafafa;\n  --ec-featured-scene-bg: var(--wb-palette-brand-1);\n  --ec-featured-scene-overlay:\n    linear-gradient(\n      180deg,\n      transparent 18.78%,\n      var(--wb-bg-card) 90.23%);\n  --ec-featured-scene-border:\n    linear-gradient(\n      180deg,\n      rgba(0, 0, 0, 0) 0%,\n      rgba(0, 0, 0, .08) 100%);\n  --ec-featured-scene-shadow: none;\n  --ec-featured-scene-fade-mask:\n    linear-gradient(\n      90deg,\n      rgba(250, 250, 250, 0),\n      rgba(250, 250, 250, .92));\n  --ec-featured-scene-row-hover-bg: rgba(0, 0, 0, .05);\n  --ec-featured-scene-tag-bg: rgba(0, 0, 0, .05);\n  --wb-kb-brand: #4ecba0;\n  --wb-kb-brand-hover: #3db890;\n  --wb-kb-text-primary: var(--wb-text-strong, rgba(0, 0, 0, .9));\n  --wb-kb-text-secondary: var(--wb-text-medium, rgba(0, 0, 0, .7));\n  --wb-kb-text-tertiary: var(--wb-text-weak, rgba(0, 0, 0, .5));\n  --wb-kb-text-muted: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-card-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-card-bg-soft: #f8fafd;\n  --wb-kb-card-border: #f0f4f5;\n  --wb-kb-card-border-soft: #f0f4f5;\n  --wb-kb-btn-primary-bg: var(--wb-button-primary-bg, rgba(0, 0, 0, .9));\n  --wb-kb-btn-primary-bg-hover: var(--wb-button-primary-bg-hover, #000000);\n  --wb-kb-btn-primary-fg: var(--wb-button-primary-fg, #ffffff);\n  --wb-kb-btn-surface: var(--wb-bg-primary, #ffffff);\n  --wb-kb-btn-surface-hover: var(--wb-bg-hover, #fafafa);\n  --wb-kb-btn-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-btn-border-hover: rgba(0, 0, 0, .2);\n  --wb-kb-btn-text: var(--wb-text-strong, rgba(0, 0, 0, .9));\n  --wb-kb-row-hover-bg: var(--wb-bg-hover, rgba(0, 0, 0, .05));\n  --wb-kb-row-selected-bg: var(--wb-bg-active, rgba(0, 0, 0, .08));\n  --wb-kb-tabs-container-bg: #f4f5f5;\n  --wb-kb-tabs-container-border: #ebecec;\n  --wb-kb-tabs-active-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-tabs-active-shadow: 0 1px 4px rgba(0, 0, 0, .1);\n  --wb-kb-tab-hover-bg: rgba(0, 0, 0, .04);\n  --wb-kb-dialog-bg: var(--wb-bg-popover, #ffffff);\n  --wb-kb-dialog-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-dialog-divider: var(--wb-border-subtle, rgba(229, 233, 240, .5));\n  --wb-kb-dialog-shadow: 0 8px 24px rgba(0, 0, 0, .08);\n  --wb-kb-dialog-section-label: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-input-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-input-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-input-placeholder: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-input-icon: #b2b2b2;\n  --wb-kb-banner-avatar-bg: #fde68a;\n  --wb-kb-checkbox-accent: rgba(0, 0, 0, .9);\n  --wb-kb-checkbox-check-color: #ffffff;\n}\n.connector-panel .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.connector-panel .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.um-header__tabs {\n  display: flex;\n  align-items: center;\n  flex-wrap: nowrap;\n  gap: 4px;\n  flex-shrink: 0;\n}\n.um-tab {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  white-space: nowrap;\n  gap: 4px;\n  height: 28px;\n  padding: 0 10px;\n  border: none;\n  border-radius: var(--wb-radius-lg, 8px);\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.um-tab:hover {\n  color: var(--wb-color-text-primary);\n}\n.um-tab--active {\n  background: var(--wb-bg-pill-active);\n  color: var(--wb-text-white);\n}\n.um-tab--active svg {\n  color: var(--wb-text-white);\n}\n.um-tab--active svg path {\n  fill: var(--wb-text-white);\n}\n.um-tab--active:hover {\n  color: var(--wb-text-white);\n}\n.ec-picker-panel {\n  --ec-bg-primary: var(--wb-bg-primary);\n  --ec-bg-secondary: var(--wb-bg-secondary);\n  --ec-bg-tertiary: var(--wb-bg-tertiary);\n  --ec-bg-hover: var(--wb-bg-hover);\n  --ec-bg-active: var(--wb-bg-active);\n  --ec-text-primary: var(--wb-color-text-primary);\n  --ec-text-secondary: var(--wb-color-text-secondary);\n  --ec-text-tertiary: var(--wb-color-text-tertiary);\n  --ec-text-placeholder: var(--wb-color-text-disabled);\n  --ec-text-desc: var(--wb-color-text-secondary);\n  --ec-text-usage: var(--wb-color-text-tertiary);\n  --ec-text-use-count: var(--wb-color-text-tertiary);\n  --ec-text-category-tab: var(--wb-color-text-secondary);\n  --ec-text-contrast: var(--wb-text-on-primary);\n  --ec-text-soft: var(--wb-color-text-secondary);\n  --ec-text-strong: var(--wb-color-text-primary);\n  --ec-text-muted: var(--wb-color-text-tertiary);\n  --ec-expert-card-bg: var(--wb-bg-secondary);\n  --ec-expert-card-hover-bg: var(--wb-bg-tertiary);\n  --ec-expert-card-hover-border: var(--wb-color-border-primary);\n  --ec-expert-card-avatar-bg: var(--wb-bg-tertiary);\n  --ec-expert-card-shadow: none;\n  --ec-expert-card-desc-color: var(--wb-color-text-secondary);\n  --ec-card-tag-bg: var(--wb-bg-tertiary);\n  --ec-card-tag-border: var(--wb-color-border-secondary);\n  --ec-card-tag-color: var(--wb-color-text-secondary);\n  --ec-filter-border: var(--wb-color-border-secondary);\n  --ec-filter-text: var(--wb-color-text-secondary);\n  --ec-filter-text-hover: var(--wb-color-text-primary);\n  --ec-filter-text-active: var(--wb-color-text-primary);\n  --ec-primary: var(--wb-color-text-primary);\n  --ec-primary-light: var(--wb-bg-tertiary);\n  --ec-primary-shadow: var(--wb-bg-active);\n  --ec-border: var(--wb-color-border-secondary);\n  --ec-border-light: var(--wb-color-border-secondary);\n  --ec-border-hover: var(--wb-color-border-primary);\n  --ec-border-subtle: var(--wb-color-border-secondary);\n  --ec-card-bg: var(--wb-bg-secondary);\n  --ec-modal-bg: var(--wb-bg-popover);\n  --ec-card-border-static: var(--wb-color-border-secondary);\n  --ec-card-shadow: none;\n  --ec-card-shadow-hover: none;\n  --ec-card-border-hover: var(--wb-color-border-primary);\n  --ec-surface-muted: var(--wb-bg-secondary);\n  --ec-surface-subtle: var(--wb-bg-tertiary);\n  --ec-surface-hover: var(--wb-bg-hover);\n  display: flex;\n  flex-direction: column;\n  width: min(1060px, calc(100vw - 48px));\n  height: min(780px, calc(100vh - 90px));\n  border-radius: 16px;\n  border: 1px solid var(--wb-color-border-secondary);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-xl);\n  overflow: hidden;\n  animation: ec-picker-scale-in .2s ease-out;\n}\n.ec-picker-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 54px;\n  padding: 0 20px;\n  border-bottom: 1px solid var(--wb-border-card);\n  flex-shrink: 0;\n}\n.ec-picker-header-right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.ec-picker-header-right .ec-search-wrapper {\n  width: 220px;\n}\n.ec-picker-panel .ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-category-tab.is-active {\n  background: var(--wb-bg-active);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-expert-card {\n  border-color: var(--wb-color-border-secondary);\n}\n.ec-expert-card--selectable {\n  cursor: pointer;\n  transition:\n    border-color .15s,\n    box-shadow .15s,\n    background .15s;\n}\n.ec-expert-card--selectable:hover:not(.ec-expert-card--selected) {\n  border-color: var(--wb-color-border-primary);\n}\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected,\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected:hover {\n  border-color: var(--wb-button-primary-bg);\n  box-shadow: 0 0 0 1px var(--wb-button-primary-bg);\n  background: var(--wb-bg-tertiary);\n  transform: none;\n}\n.ec-expert-card--disabled {\n  opacity: .5;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.ec-category-tabs,\n.ec-expert-grid {\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-category-tabs::-webkit-scrollbar,\n.ec-expert-grid::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n}\n.ec-category-tabs::-webkit-scrollbar-track,\n.ec-expert-grid::-webkit-scrollbar-track {\n  background: transparent;\n  border-radius: 2px;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb,\n.ec-expert-grid::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 2px;\n  transition: background .2s ease;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb:hover,\n.ec-expert-grid::-webkit-scrollbar-thumb:hover {\n  background: var(--wb-bg-tertiary);\n}\n.ec-category-tabs::-webkit-scrollbar-corner,\n.ec-expert-grid::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.ec-category-tabs-wrap {\n  position: relative;\n  margin-bottom: 12px;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-category-tabs {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  width: 100%;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 0 0 2px;\n  cursor: grab;\n  user-select: none;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  -webkit-mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n  mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n}\n.ec-category-tabs.is-dragging,\n.ec-category-tabs.is-dragging * {\n  cursor: grabbing;\n}\n.ec-category-tabs::-webkit-scrollbar {\n  display: none;\n}\n.ec-category-tabs-next {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: var(--wb-bg-tertiary);\n  color: var(--wb-text-muted);\n  cursor: pointer;\n}\n.ec-category-tabs-next-icon {\n  width: 7px;\n  height: 7px;\n  border-top: 2px solid currentColor;\n  border-right: 2px solid currentColor;\n  transform: translate(-1px) rotate(45deg);\n}\n.ec-category-tab {\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  cursor: pointer;\n  padding: 4px 12px;\n  height: 28px;\n  border-radius: 6px;\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.ec-category-tab.is-active {\n  background: var(--wb-bg-inset-strong);\n  color: var(--wb-color-text-primary);\n  font-weight: 600;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n.ec-expert-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));\n  gap: 12px;\n  align-content: start;\n}\n.ec-expert-card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-height: 154px;\n  padding: 16px 20px;\n  background: var(--wb-bg-card);\n  border: 1px solid var(--wb-border-card-static);\n  border-radius: 16px;\n  cursor: pointer;\n  transition:\n    box-shadow .2s ease,\n    transform .2s ease,\n    background .2s ease,\n    border-color .2s ease;\n  position: relative;\n  overflow: hidden;\n  box-shadow: var(--wb-shadow-card-soft);\n  box-sizing: border-box;\n  opacity: 0;\n  transform: translateY(4px);\n  animation-delay: var(--delay, 0s);\n  animation: fadeInUp .25s ease forwards;\n}\n.ec-expert-card:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default), var(--wb-shadow-card-soft);\n}\n.ec-expert-card:hover {\n  background: var(--wb-bg-card-hover);\n  border-color: var(--wb-border-default);\n  box-shadow: var(--wb-shadow-card-soft);\n  transform: translateY(0);\n}\n.ec-card-main {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.ec-card-main:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default);\n}\n.ec-card-head {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n}\n.ec-card-avatar-sq {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  background: var(--wb-avatar-bg-accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ec-card-avatar-sq img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-card-body {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  flex-direction: column;\n  gap: 2px;\n}\n.ec-card-title-row {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 4px;\n  min-width: 0;\n}\n.ec-card-tags {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-wrap: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-card-tag {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 20px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ec-card-subtitle {\n  color: var(--wb-color-text-primary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 16px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-role-wrap {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n}\n.ec-card-role {\n  flex: 0 1 auto;\n  min-width: 0;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n  line-height: 20px;\n  letter-spacing: 0;\n  margin-bottom: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-desc {\n  width: 100%;\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 18px;\n  display: -webkit-box;\n  line-clamp: 2;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  min-height: 36px;\n}\n.ec-card-summon-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 24px;\n  padding: 0 10px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 24px;\n  white-space: nowrap;\n  flex-shrink: 0;\n  box-shadow: none;\n  cursor: pointer;\n  transition: background .15s ease, color .15s ease;\n  outline: none;\n}\n.ec-card-summon-btn--top {\n  position: absolute;\n  top: 16px;\n  right: 20px;\n  z-index: 2;\n  opacity: 0;\n  pointer-events: none;\n  transition:\n    opacity .15s ease,\n    background .15s ease,\n    color .15s ease;\n}\n.ec-card-summon-btn--top:before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 100%;\n  width: 40px;\n  height: 100%;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      var(--wb-bg-card));\n  pointer-events: none;\n}\n.ec-expert-card:hover .ec-card-summon-btn--top:before,\n.ec-expert-card:focus-within .ec-card-summon-btn--top:before {\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      color-mix(in srgb, var(--wb-palette-black-100) 5%, var(--wb-bg-card)));\n}\n.ec-expert-card:hover .ec-card-summon-btn--top,\n.ec-expert-card:focus-within .ec-card-summon-btn--top {\n  opacity: 1;\n  pointer-events: auto;\n}\n.ec-card-summon-btn:hover {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n}\n.ec-card-summon-btn:focus,\n.ec-card-summon-btn:focus-visible,\n.ec-card-summon-btn:active {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n  box-shadow: none;\n  transform: none;\n  outline: none;\n}\n.ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-inset-strong);\n  border-color: var(--wb-border-card);\n}\n.ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-category-tabs {\n  padding: 0 0 2px;\n}\n.ec-category-tab {\n  padding: 4px 10px;\n  font-size: 12px;\n}\n.ec-modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  background: var(--wb-color-mask-color);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: ec-overlay-in .15s ease;\n}\n.ec-modal-card {\n  background: var(--wb-bg-primary);\n  border-radius: 16px;\n  width: 520px;\n  max-width: 90vw;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: var(--wb-shadow-dialog-md);\n  opacity: 0;\n  transition: opacity .12s ease-out;\n  position: relative;\n  overflow: hidden;\n  animation: ec-modal-in .2s ease forwards;\n}\n.ec-modal-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 0 20px;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-modal-body::-webkit-scrollbar {\n  width: 4px;\n}\n.ec-modal-body::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 999px;\n}\n.ec-modal-close {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  width: 24px;\n  height: 24px;\n  border: none;\n  border-radius: var(--wb-radius-md);\n  background: transparent;\n  color: var(--wb-text-muted);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-modal-close:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-modal-top {\n  display: flex;\n  align-items: flex-start;\n  flex-shrink: 0;\n  gap: 12px;\n  margin-bottom: 14px;\n  padding: 22px 52px 0 20px;\n}\n.ec-modal-avatar {\n  width: 76px;\n  height: 76px;\n  border-radius: 12px;\n  overflow: hidden;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ec-modal-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-modal-avatar-fallback {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--wb-button-primary-fg);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--wb-avatar-bg-fallback-6),\n      var(--wb-avatar-bg-fallback-2));\n}\n.ec-modal-info {\n  flex: 1;\n  min-width: 0;\n}\n.ec-modal-title-row {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n  min-width: 0;\n}\n.ec-modal-role {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--wb-color-text-primary);\n  line-height: 1.3;\n  letter-spacing: -.02em;\n  margin: 0;\n}\n.ec-modal-meta {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 6px;\n  min-width: 0;\n  margin-top: 4px;\n}\n.ec-modal-name {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--wb-color-text-secondary);\n  line-height: 18px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ec-modal-type-badge {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 4px;\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 20px;\n}\n.ec-modal-category-badge {\n  display: inline-flex;\n  align-items: center;\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 11px;\n  font-weight: 500;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-color-text-secondary);\n}\n.ec-modal-use-count-row {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  margin-top: 4px;\n}\n.ec-modal-use-count {\n  display: inline-flex;\n  align-items: center;\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n  font-weight: 500;\n  line-height: 20px;\n}\n.ec-modal-content,\n.ec-modal-tags-section {\n  margin-bottom: 18px;\n}\n.ec-modal-tags-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.ec-modal-tag-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 0 12px;\n  border-radius: 6px;\n  font-size: 12px;\n  line-height: 1;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  border: 1px solid var(--wb-border-weak);\n  height: 30px;\n  box-sizing: border-box;\n  white-space: nowrap;\n}\n.ec-modal-quick-prompts {\n  margin-bottom: 16px;\n}\n.ec-modal-quick-prompts-list {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.ec-modal-quick-prompt-btn {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  text-align: left;\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.5;\n  cursor: pointer;\n  padding: 10px 14px;\n  background: var(--wb-bg-hover);\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--wb-border-weak);\n  border-image: initial;\n  border-radius: 8px;\n  transition: background .12s;\n  gap: 12px;\n}\n.ec-modal-quick-prompt-btn:hover {\n  background: var(--wb-bg-active);\n}\n.ec-modal-quick-prompt-text {\n  flex: 1;\n  min-width: 0;\n  font-size: inherit;\n  line-height: inherit;\n  color: inherit;\n}\n.ec-modal-section-title {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--wb-color-text-tertiary);\n  margin-bottom: 8px;\n}\n.ec-modal-desc {\n  font-size: 13px;\n  line-height: 1.6;\n  color: var(--wb-color-text-secondary);\n  margin: 0;\n}\n.ec-modal-footer {\n  display: flex;\n  justify-content: center;\n  flex-shrink: 0;\n  padding: 16px 20px 20px;\n  border-top: 1px solid var(--wb-border-default);\n  background: var(--wb-bg-primary);\n}\n.ec-modal-summon-btn {\n  width: 100%;\n  height: 42px;\n  padding: 0 24px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition:\n    background .15s ease,\n    opacity .15s ease,\n    transform .15s ease;\n  letter-spacing: .2px;\n}\n.ec-modal-summon-btn:hover {\n  background: var(--wb-button-primary-bg-hover);\n  opacity: .96;\n}\n.ec-modal-summon-btn:active {\n  transform: translateY(0);\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  margin-left: auto;\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  width: 100%;\n  flex-basis: 100%;\n}\n.expert-import-modal-card .ec-modal-close:disabled,\n.expert-import-modal-card .ec-modal-summon-btn:disabled {\n  cursor: not-allowed;\n  opacity: .7;\n}\n.ec-search-wrapper {\n  width: 200px;\n  min-width: 160px;\n}\n.ec-modal-card.is-expert-view {\n  border: .5px solid #dedede;\n  box-shadow: var(--wb-shadow-dialog);\n}\n.ec-modal-card.is-expert-view .ec-modal-close:hover {\n  background: var(--wb-palette-gray-2);\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n  margin-left: auto;\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-card .ec-modal-top {\n  align-items: center;\n  gap: var(--wb-spacing-7);\n  margin-bottom: var(--wb-spacing-6);\n  padding: var(--wb-spacing-7) var(--wb-spacing-6) 0 var(--wb-spacing-7);\n}\n.ec-modal-card .ec-modal-avatar {\n  width: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  height: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  border-radius: 50%;\n}\n.ec-modal-card .ec-modal-role {\n  flex: 1;\n  min-width: 0;\n  display: block;\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h2-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-h2-line-height);\n  letter-spacing: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-role-secondary {\n  color: var(--wb-palette-black-60);\n}\n.ec-modal-role-separator {\n  width: calc(var(--wb-spacing-1) / 2);\n  height: var(--wb-font-caption-line-height);\n  margin: 0 var(--wb-spacing-3);\n  flex-shrink: 0;\n  display: inline-block;\n  object-fit: fill;\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.ec-modal-scroll-shell {\n  position: relative;\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.ec-modal-card .ec-modal-body {\n  padding: 0 var(--wb-spacing-7) var(--wb-spacing-7);\n}\n.ec-modal-scroll-shell.has-top-fade .ec-modal-scroll-fade-top,\n.ec-modal-scroll-shell.has-bottom-fade .ec-modal-scroll-fade-bottom {\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-content {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-desc {\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n}\n.ec-modal-card .ec-modal-tags-list {\n  gap: var(--wb-spacing-3);\n  margin-top: var(--wb-spacing-5);\n}\n.ec-modal-card .ec-modal-tag-chip {\n  height: var(--wb-spacing-7);\n  padding: 0 calc(var(--wb-spacing-3) + var(--wb-spacing-1));\n  border: 0;\n  border-radius: var(--wb-radius-md);\n  background: var(--wb-palette-gray-3);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-caption-size);\n}\n.ec-modal-card .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-1);\n}\n.ec-modal-section-title-with-icon {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary, rgba(0, 0, 0, .9));\n  font-family: PingFang SC;\n  font-size: var(--wb-font-h3-size);\n  font-weight: var(--wb-font-h3-weight);\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card .ec-modal-quick-prompts {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-quick-prompts:last-child {\n  margin-bottom: 0;\n}\n.ec-modal-quick-prompts-panel {\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-9) var(--wb-spacing-7);\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n  margin-top: var(--wb-spacing-5);\n  border-radius: var(--wb-radius-xl);\n  background: var(--wb-bg-secondary);\n}\n.ec-modal-card .ec-modal-quick-prompts-list {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  width: auto;\n  max-width: 100%;\n  min-height: calc(var(--wb-spacing-9) + var(--wb-spacing-1));\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  align-items: center;\n  border: 0;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-card-soft);\n  gap: var(--wb-spacing-4);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-code-size);\n  line-height: var(--wb-font-code-line-height);\n}\n.ec-modal-quick-prompt-btn-1,\n.ec-modal-quick-prompt-btn-3 {\n  transform: none;\n}\n.ec-modal-quick-prompt-btn-2 {\n  width: calc(100% - var(--wb-spacing-10));\n  transform: none;\n}\n.ec-modal-card .ec-modal-quick-prompt-text {\n  color: inherit;\n  white-space: normal;\n}\n.ec-modal-card .ec-modal-quick-prompt-text strong {\n  margin-right: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary);\n  font-weight: 700;\n}\n.ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n}\n.ec-modal-quick-prompts > .ec-modal-section-title {\n  margin-bottom: 0;\n}\n.ec-modal-quick-prompts-panel {\n  --ec-qpc-panel-padding-block: var(--wb-spacing-9);\n  --ec-qpc-panel-padding-inline: var(--wb-spacing-7);\n  --ec-qpc-bubble-padding-block: calc(var(--wb-spacing-4) - var(--wb-spacing-1) / 2);\n  --ec-qpc-bubble-padding-inline: var(--wb-spacing-5);\n  --ec-qpc-bubble-gap: var(--wb-spacing-4);\n  --ec-qpc-bubble-radius: var(--wb-radius-2xl);\n  --ec-qpc-bubble-shadow: var(--wb-shadow-card-soft);\n  --ec-qpc-content-gap: var(--wb-spacing-4);\n  --ec-qpc-slot-height: calc(var(--wb-spacing-10) + var(--wb-spacing-2));\n  --ec-qpc-static-height: calc(var(--ec-qpc-slot-height) * 3 + var(--ec-qpc-bubble-gap) * 2);\n  --ec-qpc-shadow-safe-x: var(--wb-spacing-4);\n  --ec-qpc-shadow-safe-y: var(--wb-spacing-7);\n  --ec-qpc-edge-opacity: .78;\n  --ec-qpc-focus-scale: 1.018;\n  flex-shrink: 0;\n  display: flex;\n  padding: 0;\n  flex-direction: column;\n  justify-content: center;\n  align-items: stretch;\n  gap: var(--wb-spacing-5);\n  margin-top: var(--wb-spacing-5);\n  border-radius: 0;\n  background: transparent;\n  position: relative;\n}\n.ec-modal-quick-prompts-stack {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-quick-prompts-stack .ec-modal-quick-prompt-slot {\n  height: auto;\n}\n.ec-modal-quick-prompts-carousel-stage {\n  position: relative;\n  width: 100%;\n  height: var(--ec-qpc-static-height);\n  overflow: visible;\n  isolation: isolate;\n}\n.ec-modal-quick-prompts-viewport {\n  position: absolute;\n  inset-block: calc(0px - var(--ec-qpc-shadow-safe-y));\n  inset-inline: calc(0px - var(--ec-qpc-shadow-safe-x));\n  padding-block: var(--ec-qpc-shadow-safe-y);\n  padding-inline: var(--ec-qpc-shadow-safe-x);\n  overflow: hidden;\n  pointer-events: auto;\n}\n.ec-modal-quick-prompts-viewport:before,\n.ec-modal-quick-prompts-viewport:after {\n  content: \"\";\n  position: absolute;\n  left: var(--ec-qpc-shadow-safe-x);\n  right: var(--ec-qpc-shadow-safe-x);\n  z-index: 4;\n  height: var(--ec-qpc-shadow-safe-y);\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-viewport:before {\n  top: 0;\n  background:\n    linear-gradient(\n      180deg,\n      var(--wb-bg-secondary) 0%,\n      transparent 100%);\n}\n.ec-modal-quick-prompts-viewport:after {\n  bottom: 0;\n  background:\n    linear-gradient(\n      0deg,\n      var(--wb-bg-secondary) 0%,\n      transparent 100%);\n}\n.ec-modal-quick-prompts-track {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--ec-qpc-bubble-gap);\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(.42, 0, .58, 1);\n  will-change: transform;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-hidden {\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-focused,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot:hover,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot:focus-within {\n  --ec-qpc-slot-focus: 1;\n  --ec-qpc-slot-focus-scale: var(--ec-qpc-focus-scale);\n  opacity: 1;\n  z-index: 6;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn {\n  width: 100%;\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-5);\n  border: .5px solid transparent;\n  background: var(--wb-palette-gray-2);\n  border-radius: var(--wb-radius-2xl);\n  box-shadow: none;\n  color: var(--wb-color-text-secondary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: var(--wb-font-body-weight);\n  font-style: normal;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n  text-align: left;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), border-color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-btn,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-btn {\n  background: var(--wb-palette-gray-3);\n  border-color: var(--ec-modal-quick-prompt-border);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:focus-visible {\n  outline: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-focus);\n  outline-offset: calc(var(--wb-spacing-1) / 2);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-text {\n  min-width: 0;\n  flex: 1;\n  display: -webkit-box;\n  color: inherit;\n  white-space: normal;\n  overflow-wrap: anywhere;\n  overflow: hidden;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n  color: var(--wb-palette-black-50);\n  transition: color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-action {\n  color: var(--wb-palette-black-70);\n}\n.ec-modal-quick-prompts-track,\n.ec-modal-quick-prompt-slot,\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  transition: none !important;\n}\n.ec-modal-cases-section .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-5);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  height: calc(var(--wb-spacing-12) * 2 + var(--wb-spacing-6) + var(--wb-spacing-3));\n  padding: 0;\n  box-sizing: border-box;\n  border: .5px solid #dedede;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  overflow: hidden;\n  transition: border-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), background-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card:hover {\n  border-color: #dedede;\n  background: var(--wb-palette-gray-3);\n}\n.ec-modal-team .ec-modal-section-title {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(var(--wb-spacing-2) + var(--wb-spacing-1));\n  margin-bottom: var(--wb-spacing-5);\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h3-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card {\n  width: min(calc(var(--wb-spacing-12) * 10), calc(100vw - var(--wb-spacing-9)));\n  max-width: none;\n  height: auto;\n  max-height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n  transition: opacity var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), height var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view {\n  height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n  max-height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n}\n.ec-modal-card.is-case-view:has(.dc-detail-page.is-enlarged) {\n  width: min(calc(var(--wb-spacing-12) * 15), calc(100vw - var(--wb-spacing-8)));\n  height: min(calc(var(--wb-spacing-12) * 11 + var(--wb-spacing-5)), calc(100vh - var(--wb-spacing-12) - var(--wb-spacing-5)));\n  max-height: calc(100vh - var(--wb-spacing-12) - var(--wb-spacing-5));\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: var(--wb-spacing-8);\n  padding: 0 var(--wb-spacing-5);\n  border: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-default);\n  border-radius: var(--wb-radius-lg);\n  background: var(--wb-bg-primary);\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-code-line-height);\n  font-weight: 400;\n  font-family: inherit;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn {\n  pointer-events: auto;\n  border: none;\n  outline: calc(var(--wb-spacing-1) / 2) solid color-mix(in srgb, var(--wb-text-on-inverse) 20%, transparent);\n  outline-offset: 0;\n  color: var(--wb-text-on-inverse);\n  background: color-mix(in srgb, var(--wb-bg-inverse) 80%, transparent);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn:hover:not(:disabled) {\n  opacity: 1;\n  background: color-mix(in srgb, var(--wb-bg-inverse) 95%, transparent);\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.connector-panel .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.connector-panel .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-picker-header-right .ec-search-wrapper {\n  width: 220px;\n}\n.ec-picker-panel .ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-category-tab.is-active {\n  background: var(--wb-bg-active);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-expert-card {\n  border-color: var(--wb-color-border-secondary);\n}\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected,\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected:hover {\n  border-color: var(--wb-button-primary-bg);\n  box-shadow: 0 0 0 1px var(--wb-button-primary-bg);\n  background: var(--wb-bg-tertiary);\n  transform: none;\n}\n.ec-category-tabs,\n.ec-expert-grid {\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-category-tabs::-webkit-scrollbar,\n.ec-expert-grid::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n}\n.ec-category-tabs::-webkit-scrollbar-track,\n.ec-expert-grid::-webkit-scrollbar-track {\n  background: transparent;\n  border-radius: 2px;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb,\n.ec-expert-grid::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 2px;\n  transition: background .2s ease;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb:hover,\n.ec-expert-grid::-webkit-scrollbar-thumb:hover {\n  background: var(--wb-bg-tertiary);\n}\n.ec-category-tabs::-webkit-scrollbar-corner,\n.ec-expert-grid::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.ec-category-tabs.is-dragging,\n.ec-category-tabs.is-dragging * {\n  cursor: grabbing;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n.ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-inset-strong);\n  border-color: var(--wb-border-card);\n}\n.ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  margin-left: auto;\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  width: 100%;\n  flex-basis: 100%;\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-modal-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-modal-content,\n.ec-modal-tags-section {\n  margin-bottom: 18px;\n}\n.expert-import-modal-card .ec-modal-close:disabled,\n.expert-import-modal-card .ec-modal-summon-btn:disabled {\n  cursor: not-allowed;\n  opacity: .7;\n}\n.ec-modal-card.is-expert-view .ec-modal-close:hover {\n  background: var(--wb-palette-gray-2);\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-card .ec-modal-top {\n  align-items: center;\n  gap: var(--wb-spacing-7);\n  margin-bottom: var(--wb-spacing-6);\n  padding: var(--wb-spacing-7) var(--wb-spacing-6) 0 var(--wb-spacing-7);\n}\n.ec-modal-card .ec-modal-avatar {\n  width: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  height: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  border-radius: 50%;\n}\n.ec-modal-card .ec-modal-role {\n  flex: 1;\n  min-width: 0;\n  display: block;\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h2-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-h2-line-height);\n  letter-spacing: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-body {\n  padding: 0 var(--wb-spacing-7) var(--wb-spacing-7);\n}\n.ec-modal-scroll-shell.has-top-fade .ec-modal-scroll-fade-top,\n.ec-modal-scroll-shell.has-bottom-fade .ec-modal-scroll-fade-bottom {\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-content {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-desc {\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n}\n.ec-modal-card .ec-modal-tags-list {\n  gap: var(--wb-spacing-3);\n  margin-top: var(--wb-spacing-5);\n}\n.ec-modal-card .ec-modal-tag-chip {\n  height: var(--wb-spacing-7);\n  padding: 0 calc(var(--wb-spacing-3) + var(--wb-spacing-1));\n  border: 0;\n  border-radius: var(--wb-radius-md);\n  background: var(--wb-palette-gray-3);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-caption-size);\n}\n.ec-modal-card .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-1);\n}\n.ec-modal-card .ec-modal-quick-prompts {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-quick-prompts:last-child {\n  margin-bottom: 0;\n}\n.ec-modal-card .ec-modal-quick-prompts-list {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  width: auto;\n  max-width: 100%;\n  min-height: calc(var(--wb-spacing-9) + var(--wb-spacing-1));\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  align-items: center;\n  border: 0;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-card-soft);\n  gap: var(--wb-spacing-4);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-code-size);\n  line-height: var(--wb-font-code-line-height);\n}\n.ec-modal-quick-prompt-btn-1,\n.ec-modal-quick-prompt-btn-3 {\n  transform: none;\n}\n.ec-modal-card .ec-modal-quick-prompt-text {\n  color: inherit;\n  white-space: normal;\n}\n.ec-modal-card .ec-modal-quick-prompt-text strong {\n  margin-right: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary);\n  font-weight: 700;\n}\n.ec-modal-quick-prompts-stack .ec-modal-quick-prompt-slot {\n  height: auto;\n}\n.ec-modal-quick-prompts-viewport:before,\n.ec-modal-quick-prompts-viewport:after {\n  content: \"\";\n  position: absolute;\n  left: var(--ec-qpc-shadow-safe-x);\n  right: var(--ec-qpc-shadow-safe-x);\n  z-index: 4;\n  height: var(--ec-qpc-shadow-safe-y);\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-hidden {\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-focused,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot:hover,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot:focus-within {\n  --ec-qpc-slot-focus: 1;\n  --ec-qpc-slot-focus-scale: var(--ec-qpc-focus-scale);\n  opacity: 1;\n  z-index: 6;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn {\n  width: 100%;\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-5);\n  border: .5px solid transparent;\n  background: var(--wb-palette-gray-2);\n  border-radius: var(--wb-radius-2xl);\n  box-shadow: none;\n  color: var(--wb-color-text-secondary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: var(--wb-font-body-weight);\n  font-style: normal;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n  text-align: left;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), border-color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-btn,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-btn {\n  background: var(--wb-palette-gray-3);\n  border-color: var(--ec-modal-quick-prompt-border);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:focus-visible {\n  outline: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-focus);\n  outline-offset: calc(var(--wb-spacing-1) / 2);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-text {\n  min-width: 0;\n  flex: 1;\n  display: -webkit-box;\n  color: inherit;\n  white-space: normal;\n  overflow-wrap: anywhere;\n  overflow: hidden;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n  color: var(--wb-palette-black-50);\n  transition: color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-action {\n  color: var(--wb-palette-black-70);\n}\n.ec-modal-quick-prompts-track,\n.ec-modal-quick-prompt-slot,\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  transition: none !important;\n}\n.ec-modal-cases-section .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-5);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  height: calc(var(--wb-spacing-12) * 2 + var(--wb-spacing-6) + var(--wb-spacing-3));\n  padding: 0;\n  box-sizing: border-box;\n  border: .5px solid #dedede;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  overflow: hidden;\n  transition: border-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), background-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card:hover {\n  border-color: #dedede;\n  background: var(--wb-palette-gray-3);\n}\n.ec-modal-team .ec-modal-section-title {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(var(--wb-spacing-2) + var(--wb-spacing-1));\n  margin-bottom: var(--wb-spacing-5);\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h3-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: var(--wb-spacing-8);\n  padding: 0 var(--wb-spacing-5);\n  border: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-default);\n  border-radius: var(--wb-radius-lg);\n  background: var(--wb-bg-primary);\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-code-line-height);\n  font-weight: 400;\n  font-family: inherit;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn {\n  pointer-events: auto;\n  border: none;\n  outline: calc(var(--wb-spacing-1) / 2) solid color-mix(in srgb, var(--wb-text-on-inverse) 20%, transparent);\n  outline-offset: 0;\n  color: var(--wb-text-on-inverse);\n  background: color-mix(in srgb, var(--wb-bg-inverse) 80%, transparent);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn:hover:not(:disabled) {\n  opacity: 1;\n  background: color-mix(in srgb, var(--wb-bg-inverse) 95%, transparent);\n}\n.workbuddy-topbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 56px;\n  min-height: 56px;\n  flex-shrink: 0;\n  padding: 0 12px 0 16px;\n  box-sizing: border-box;\n  -webkit-app-region: drag;\n  position: sticky;\n  top: 0;\n  width: 100%;\n  z-index: 101;\n  transition: margin-top .18s cubic-bezier(.05, .7, .1, 1);\n  gap: 8px;\n}\n.workbuddy-topbar {\n  height: 40px;\n  min-height: 40px;\n  padding: 0 8px 0 12px;\n}\n.workbuddy-topbar.workbuddy-topbar--preview-fullscreen {\n  margin-top: 4px;\n}\n.workbuddy-topbar .workbuddy-topbar-title {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-options {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  min-width: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-left {\n  display: flex;\n  align-items: center;\n  max-width: max-content;\n  gap: 4px;\n  min-width: 0;\n  flex: 1;\n  overflow: hidden;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-left .wb-button {\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-left:has(.workbuddy-topbar-claw) {\n  flex: 1;\n  min-width: 0px;\n  max-width: max-content;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac .ec-topbar__left {\n  gap: 4px;\n  margin-left: 72px;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac.workbuddy-topbar--fullscreen .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac.workbuddy-topbar--fullscreen .ec-topbar__left {\n  margin-left: 0;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac:has(.workbuddy-topbar-title--mac-offset) .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac:has(.workbuddy-topbar-title--mac-offset) .ec-topbar__left {\n  margin-left: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-actions .wb-button--icon-only {\n  color: var(--wb-color-text-secondary);\n}\n.workbuddy-topbar .workbuddy-topbar-actions .wb-button--icon-only:hover:not(:disabled) {\n  color: var(--wb-color-text-primary);\n}\n.workbuddy-topbar .workbuddy-topbar-logo {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  text-decoration: none;\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-logo:hover {\n  opacity: .8;\n}\n.workbuddy-topbar .workbuddy-topbar-logo img {\n  width: 24px;\n  height: 24px;\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-title {\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--wb-color-text-solid);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 24px;\n  height: 24px;\n  display: inline-block;\n  vertical-align: middle;\n}\n.workbuddy-topbar .workbuddy-topbar-title--workspace {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  line-height: normal;\n  vertical-align: initial;\n}\n.workbuddy-topbar .workbuddy-topbar-title--mac-offset {\n  padding-left: 75px;\n}\n.workbuddy-topbar .workbuddy-topbar-title--workspace:has(.claw-workspace-title--peeking) {\n  width: 264px;\n  max-width: 264px;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb {\n  display: inline-flex;\n  align-items: center;\n  line-height: 24px;\n  height: 24px;\n  vertical-align: middle;\n  max-width: 100%;\n  min-width: 0;\n  overflow: hidden;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb .wb-breadcrumb__item:last-child {\n  max-width: 400px;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-root {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  color: var(--wb-color-text-tertiary);\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-last {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-last > span:first-child {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-local-badge {\n  flex: 0 0 auto;\n  height: 18px;\n  padding: 0 6px;\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid var(--wb-color-border-secondary, var(--cb-border-color, #555));\n  border-radius: 4px;\n  background: transparent;\n  color: var(--wb-color-text-secondary, var(--cb-text-secondary, #999));\n  font-size: 11px;\n  line-height: 1;\n  font-weight: 400;\n}\n.workbuddy-topbar .workbuddy-topbar-title-input {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n  background: transparent;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 4px;\n  padding: 2px 6px;\n  outline: none;\n  min-width: 120px;\n  max-width: 300px;\n  height: 24px;\n  line-height: 24px;\n  box-sizing: border-box;\n}\n.workbuddy-topbar .workbuddy-topbar-title-input:focus {\n  border-color: var(--wb-color-border-focus);\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button {\n  align-items: center;\n  justify-content: center;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0;\n  color: var(--wb-color-text-secondary);\n  transition: opacity .15s ease;\n  flex-shrink: 0;\n  height: 24px;\n  display: none;\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button:hover {\n  color: var(--wb-color-text-primary);\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button svg {\n  width: 14px;\n  height: 14px;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  overflow: hidden;\n  gap: 4px;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area .workbuddy-topbar-title {\n  min-width: 0;\n  flex-shrink: 1;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area:hover .workbuddy-topbar-edit-button {\n  display: inline-flex;\n}\n.workbuddy-topbar--scrolled {\n  border-bottom: 1px solid var(--wb-color-border-tertiary);\n}\n.connector-panel .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.connector-panel .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  -webkit-app-region: no-drag;\n}\n.connector-panel .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  -webkit-app-region: no-drag;\n}\n.connector-panel .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.workbuddy-topbar-claw {\n  flex: 1;\n  flex-shrink: 1;\n  min-width: 0;\n  max-width: max-content;\n  overflow: hidden;\n}\n.workbuddy-topbar-claw-connected-info {\n  font-size: 14px;\n  color: var(--wb-color-text-tertiary);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n  cursor: default;\n  padding: 4px 8px;\n  border-radius: 6px;\n  transition: background .15s;\n  overflow: hidden;\n  min-width: 0;\n  -webkit-app-region: no-drag;\n  max-width: max-content;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-config-link {\n  color: var(--wb-claw-text-link);\n  text-decoration: none;\n  cursor: pointer;\n  font-weight: 500;\n  border-bottom: 1px solid transparent;\n  transition: border-color .2s, color .2s;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-config-link:hover {\n  color: var(--wb-claw-text-link-hover);\n  border-bottom-color: var(--wb-claw-text-link-hover);\n}\n.workbuddy-topbar-claw-connected-label {\n  color: var(--wb-color-text-tertiary);\n  font-size: 14px;\n}\n.workbuddy-topbar-claw-channel-tags {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  flex-shrink: 1;\n  min-width: 0px;\n  overflow: hidden;\n}\n.workbuddy-topbar-claw-channel-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  flex: 0 0 auto;\n  padding: 2px 4px;\n  border-radius: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  letter-spacing: .2px;\n}\n.workbuddy-topbar-claw-channel-tag .workbuddy-topbar-claw-channel-name {\n  white-space: nowrap;\n}\n.workbuddy-topbar-claw-channel-tag .workbuddy-topbar-claw-channel-logo {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  border-radius: 3px;\n  object-fit: contain;\n}\n.workbuddy-topbar-claw-channel-overflow {\n  flex: 0 0 auto;\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n  color: var(--wb-color-text-tertiary);\n}\n.workbuddy-topbar-claw-channel-tags-probe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  gap: inherit;\n  width: max-content;\n  visibility: hidden;\n  pointer-events: none;\n}\n.workbuddy-topbar-claw-channel-overflow-probe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: max-content;\n  visibility: hidden;\n  pointer-events: none;\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-wecom {\n  color: var(--wb-claw-text-wecom);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-feishu {\n  color: var(--wb-claw-text-feishu);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-qq {\n  color: var(--wb-claw-text-qq);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-dingtalk {\n  color: var(--wb-claw-text-dingtalk);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-wechat {\n  color: var(--wb-claw-text-wechat);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-yuanbao {\n  color: var(--wb-claw-text-yuanbao);\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  border-radius: 4px;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon svg {\n  width: 14px;\n  height: 14px;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon:hover {\n  color: var(--wb-color-text-primary);\n  background-color: var(--wb-bg-hover);\n}\n.workbuddy-topbar-claw-disconnected {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n}\n.um-header__inner {\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n}\n.um-tab--active svg {\n  color: var(--wb-text-white);\n}\n.um-tab--active svg path {\n  fill: var(--wb-text-white);\n}\n[data-theme=dark] .um-tab--active,\n.vscode-dark .um-tab--active,\n.dark .um-tab--active {\n  background: var(--wb-button-grey-bg);\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg,\n.vscode-dark .um-tab--active svg,\n.dark .um-tab--active svg {\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg path,\n.vscode-dark .um-tab--active svg path,\n.dark .um-tab--active svg path {\n  fill: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active:hover,\n.vscode-dark .um-tab--active:hover,\n.dark .um-tab--active:hover {\n  color: var(--wb-button-grey-fg);\n}\n.expert-center-page {\n  --ec-page-gutter: 24px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary);\n  color: var(--wb-color-text-primary);\n}\n.expert-center-page.is-inactive {\n  opacity: .96;\n}\n.ec-list-tabs-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.ec-list-tabs {\n  display: inline-flex;\n  align-items: center;\n  gap: 20px;\n  flex-shrink: 0;\n}\n.ec-list-tab {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 28px;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: opacity .15s ease;\n}\n.ec-list-tab:hover,\n.ec-list-tab.is-active {\n  color: var(--wb-color-text-primary);\n}\n.expert-center-page {\n  --ec-page-gutter: 20px ;\n}\n.ec-page-layout {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  margin-bottom: 20px;\n  padding: 0 var(--ec-page-gutter);\n  flex-shrink: 0;\n  -webkit-app-region: drag;\n}\n.ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n.ec-main-content {\n  position: relative;\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  overflow-x: hidden;\n}\n.expert-center-page {\n  --ec-page-gutter: 20px;\n  --ec-content-gutter: 20px ;\n}\n.discover-panel-page:has(.wb-modal__overlay.dc-detail-overlay.is-open) > .workbuddy-topbar {\n  z-index: 0;\n}\n.main-content--chat,\n.main-content--chat .workbuddy-topbar,\n.main-content--initializing {\n  background: var(--wb-home-bg-secondary);\n}\n.project-detail-view > .workbuddy-topbar {\n  border-bottom: 1px solid var(--wb-border-card, var(--wb-border-default));\n}\n.skills-view .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.skills-view .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n.ec-sort-group {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n  height: 28px;\n  padding: 2px;\n  flex-shrink: 0;\n  border: none;\n  border-radius: 6px;\n  background: var(--wb-bg-inset-strong);\n  box-sizing: border-box;\n}\n.ec-sort-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 24px;\n  padding: 0 8px;\n  border-radius: 4px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 22px;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-sort-btn:hover {\n  color: var(--wb-color-text-secondary);\n}\n.ec-sort-btn.is-active {\n  background: var(--wb-bg-card);\n  color: var(--wb-color-text-primary);\n}\n.ec-avatar-sq-fallback {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--wb-button-primary-fg);\n  border-radius: 50%;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n\n/* src/app.css */\n:root {\n  --wb-spacing-12:64px;\n}\n.wbh-anchor {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.wbh-plus {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  transition: background-color 100ms ease;\n}\n.wbh-plus:hover:not(:disabled),\n.wbh-plus[aria-expanded=true] {\n  background: var(--dsw-alias-interactive-bg-hover-solid);\n}\n.wbh-popScrim {\n  position: fixed;\n  inset: 0;\n  z-index: 6240;\n}\n.wbh-pop {\n  position: absolute;\n  left: 0;\n  bottom: calc(100% + 10px);\n  z-index: 6250;\n  display: flex;\n  flex-direction: column;\n  width: min(680px, calc(100vw - 60px));\n  max-height: min(560px, calc(100vh - 160px));\n  border: 1px solid var(--wb-border-default);\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, .16);\n  overflow: hidden;\n  animation: wbhPopIn .15s ease;\n}\n@keyframes wbhPopIn {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.wbh-pop .ec-picker-panel {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  flex: 1;\n  background: var(--wb-bg-primary);\n}\n.wbh-pop .ec-expert-grid {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 0 20px 16px;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n}\n.wbh-pop .ec-category-tabs-wrap {\n  margin: 0;\n  padding: 12px 20px 8px;\n}\n.wbh-popNotice {\n  padding: 8px 20px 12px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  border-top: 1px solid var(--wb-border-default);\n}\n.wbh-page {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 0;\n}\n.wbh-market-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  height: 54px;\n  padding: 0 4px;\n  border-bottom: 1px solid var(--wb-border-default);\n}\n.wbh-market-panel .ec-expert-grid {\n  padding: 16px 4px;\n}\n.ec-market-panel {\n  display: flex;\n  flex-direction: column;\n}\n.wbh-state {\n  grid-column: 1/-1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  padding: 70px 0;\n  color: var(--wb-color-text-tertiary);\n  font-size: 13px;\n}\n.wbh-state p {\n  margin: 0;\n}\n.wbh-avatar-letter {\n  display: grid;\n  place-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--wb-button-primary-fg);\n  background: var(--wb-avatar-bg-accent);\n}\n.wbh-authBar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 10px 4px 14px;\n}\n.wbh-authState {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-dot {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--wb-palette-green-1,#2b8a3e);\n}\n.wbh-dot.off {\n  background: var(--wb-color-text-tertiary);\n}\n.wbh-notice {\n  margin: 10px 4px 0;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-muted {\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-btnPrimary,\n.wbh-btnGhost {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 30px;\n  padding: 0 14px;\n  border-radius: 8px;\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background .15s ease;\n}\n.wbh-btnPrimary {\n  border: none;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n}\n.wbh-btnPrimary:hover {\n  background: var(--wb-button-primary-bg-hover);\n}\n.wbh-btnGhost {\n  border: 1px solid var(--wb-border-default);\n  background: transparent;\n  color: var(--wb-color-text-primary);\n}\n.wbh-btnGhost:hover {\n  background: var(--wb-bg-hover);\n}\n.wbh-rail {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  margin-left: 6px;\n  flex-wrap: nowrap;\n}\n.wbh-railChip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 32px;\n  padding: 0 8px;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  cursor: default;\n  flex-shrink: 0;\n  transition: background-color .15s ease;\n}\n.wbh-railChip:hover,\n.wbh-railChip:focus-within {\n  background: var(--wbh-chip-hover-bg,rgba(0,0,0,.06));\n}\n.wbh-chipClose {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  padding: 0;\n  border: none;\n  border-radius: 4px;\n  background: transparent;\n  color: rgba(0, 0, 0, .5);\n  cursor: pointer;\n  flex-shrink: 0;\n  transition: color .15s ease;\n}\n.wbh-railChip:hover .wbh-chipClose,\n.wbh-chipClose:focus-visible {\n  color: rgba(0, 0, 0, .9);\n}\n.wbh-chipClose:focus-visible {\n  outline: 2px solid #007fd4;\n  outline-offset: 1px;\n}\n.wbh-chipClose:disabled {\n  opacity: .45;\n  cursor: default;\n}\n.wbh-chipLogo {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  background: #f5f5f5;\n}\n.wbh-chipLogo img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.wbh-chipLogo.is-connector {\n  margin-left: -4px;\n  border-radius: 50%;\n}\n.wbh-chipLogo img.wbh-chipLogoImg {\n  width: 16px;\n  height: 16px;\n  object-fit: cover;\n  border-radius: 50%;\n}\n.wbh-chipLabel {\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 20px;\n  color: rgba(0, 0, 0, .5);\n  max-width: 140px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  user-select: none;\n}\n.wbh-railChip:hover .wbh-chipLabel,\n.wbh-railChip:focus-within .wbh-chipLabel {\n  color: rgba(0, 0, 0, .9);\n}\n.wbh-settings {\n  padding: 4px 2px;\n}\n.wbh-secTitle {\n  margin: 0 0 10px;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.wbh-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 8px 0;\n  border-bottom: 1px solid var(--wb-border-default);\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-installedRow {\n  align-items: center;\n}\n.wbh-installedName {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--wb-color-text-primary);\n}\n.wbh-installedActions {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  flex: none;\n}\n.wbh-removeBtn {\n  height: 26px;\n  padding: 0 10px;\n  font-size: 12px;\n}\n.wbh-confirmRow {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.wbh-confirmText {\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  white-space: nowrap;\n}\n.wbh-btnDanger {\n  display: inline-flex;\n  align-items: center;\n  height: 26px;\n  padding: 0 12px;\n  border: 1px solid #ffccc7;\n  border-radius: 8px;\n  background: #fff1f0;\n  color: #d4380d;\n  font: inherit;\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background .15s ease;\n}\n.wbh-btnDanger:hover:not(:disabled) {\n  background: #ffe0dc;\n}\n.wbh-btnDanger:disabled {\n  cursor: default;\n  opacity: .6;\n}\n.wbh-removeNotice {\n  margin: 0 0 8px;\n  padding: 7px 10px;\n  border: 1px solid #b7eb8f;\n  border-radius: 8px;\n  background: #f6ffed;\n  color: #237804;\n  font-size: 12px;\n}\n.wbh-removeNotice.is-error {\n  border-color: #ffccc7;\n  background: #fff2f0;\n  color: #cf1322;\n}\n.wbh-updateBar {\n  border-bottom: none;\n  padding-bottom: 2px;\n}\n.wbh-updateSummary {\n  flex: 1;\n  min-width: 0;\n  font-size: 11.5px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-updateSummary.is-error {\n  color: #cf1322;\n}\n.wbh-updateWarn {\n  margin: 0 0 8px;\n  padding: 7px 10px;\n  border: 1px solid #ffe58f;\n  border-radius: 8px;\n  background: #fffbe6;\n  color: #ad6800;\n  font-size: 12px;\n  line-height: 1.6;\n}\n.wbh-badge {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 8px;\n  border-radius: 999px;\n  border: 1px solid transparent;\n  font-size: 11px;\n  line-height: 1;\n  white-space: nowrap;\n  cursor: default;\n}\n.wbh-badgeUpdate {\n  border-color: #ffd591;\n  background: #fff7e6;\n  color: #ad4e00;\n  font-weight: 600;\n}\n.wbh-badgeCurrent {\n  border-color: #b7eb8f;\n  background: #f6ffed;\n  color: #237804;\n}\n.wbh-badgeUnknown {\n  border-color: var(--wb-border-default);\n  background: var(--wb-bg-tertiary,#f4f4f4);\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-updateBtn,\n.wbh-updateAllBtn,\n.wbh-checkBtn {\n  height: 26px;\n  padding: 0 10px;\n  font-size: 12px;\n}\n.wbh-updateBtn {\n  border-color: #ffd591;\n  color: #ad4e00;\n}\n.wbh-updateConfirmBtn {\n  height: 26px;\n  padding: 0 12px;\n  font-size: 12px;\n}\n.wbh-modalInput {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px 10px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-color-text-primary);\n  font: inherit;\n  font-size: 12px;\n  resize: vertical;\n  outline: none;\n}\n.wbh-modalInput:focus {\n  border-color: var(--wb-border-hover);\n}\n.wbh-authCard {\n  position: relative;\n  width: min(560px, calc(100vw - 48px));\n  max-height: calc(100vh - 80px);\n  overflow: auto;\n  padding: 24px;\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, .18);\n  animation: wbhPopIn .15s ease;\n}\n.wbh-authHead {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n.wbh-authTitle {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 650;\n  color: var(--wb-color-text-primary);\n}\n.wbh-authClose {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n}\n.wbh-authClose:hover {\n  background: var(--wb-bg-hover);\n}\n.wbh-authDesc {\n  margin: 8px 0 14px;\n  font-size: 12.5px;\n  line-height: 1.7;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-authQr {\n  display: grid;\n  place-items: center;\n  padding: 12px;\n  margin: 0 auto 12px;\n  width: min(344px, 100%);\n  border-radius: 12px;\n  background: #fff;\n}\n.wbh-authQr img {\n  display: block;\n  width: 320px;\n  height: 320px;\n}\n.wbh-authLink {\n  display: block;\n  width: 100%;\n  text-align: left;\n  padding: 8px 12px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-palette-blue-1,#2f6bff);\n  font-size: 12px;\n  cursor: pointer;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.wbh-authCopy {\n  display: block;\n  margin: 10px auto 0;\n  padding: 6px 16px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 10px;\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  font-size: 13px;\n  cursor: pointer;\n}\n.wbh-authWaiting {\n  margin: 14px 0 0;\n  text-align: center;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-authCancel {\n  display: block;\n  width: 100%;\n  margin-top: 16px;\n  padding: 10px;\n  border-radius: 12px;\n}\n.wbh-authDone {\n  padding: 20px 0 6px;\n  text-align: center;\n}\n.wbh-authDone p {\n  margin: 0 0 14px;\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n}\n.wbh-authError {\n  color: #c0392b;\n}\n.wbh-modalRoot {\n  position: fixed;\n  inset: 0;\n  z-index: 6300;\n  display: grid;\n  place-items: center;\n}\n.wbh-modalScrim {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, .28);\n  animation: wbhFade .15s ease;\n}\n@keyframes wbhFade {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes ec-overlay-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes ec-modal-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes ec-picker-scale-in {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.ec-market-panel {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n}\n.expert-center-page {\n  --ec-page-gutter:24px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary,#f7f7f7);\n  color: var(--wb-color-text-primary);\n}\n.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 var(--ec-page-gutter);\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary,#f7f7f7);\n}\n.ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.ec-page-layout {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.ec-main-content {\n  position: relative;\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.ec-main-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-list-tabs-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n  padding: 4px var(--ec-page-gutter);\n}\n.ec-list-tabs {\n  display: inline-flex;\n  align-items: center;\n  gap: 20px;\n  flex-shrink: 0;\n}\n.ec-list-tab {\n  position: relative;\n  padding: 4px 0;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: color .2s ease;\n}\n.ec-list-tab:hover {\n  color: var(--wb-color-text-secondary);\n}\n.ec-list-tab.is-active {\n  color: var(--wb-color-text-primary);\n  font-weight: 600;\n}\n.ec-list-tab.is-active::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: -3px;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--wb-color-text-primary);\n}\n.ec-category-tabs-wrap {\n  margin: 0 0 12px;\n}\n.ec-category-tab {\n  font-size: 12.5px;\n  padding: 4px 12px;\n}\n.ec-category-tab-count {\n  margin-left: 1px;\n  opacity: .6;\n}\n.ec-picker-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-modal-overlay {\n  z-index: 6300;\n  padding: 20px;\n}\n.ec-modal-card {\n  width: 640px;\n  max-width: calc(100vw - 40px);\n  max-height: 640px;\n  box-sizing: border-box;\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  font-size: 14px;\n  line-height: 22px;\n  background: #f7f7f7;\n  min-height: 48px;\n  height: 48px;\n  gap: 16px;\n  padding: 12px 16px;\n  border: none;\n  box-sizing: border-box;\n}\n.ec-modal-card .ec-modal-quick-prompt-btn .ec-modal-quick-prompt-text {\n  font-size: 14px;\n  line-height: 22px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  min-width: 124px;\n  height: 32px;\n  padding: 0 24px;\n}\n.ec-modal-card.is-expert-view .ec-modal-close {\n  padding: 0;\n}\n.wbh-newSessionBtn {\n  display: block;\n  width: 100%;\n  margin-top: 6px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-family: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  text-align: center;\n  cursor: pointer;\n}\n.wbh-newSessionBtn:hover:not(:disabled) {\n  color: var(--wb-color-text-primary);\n  text-decoration: underline;\n}\n.wbh-newSessionBtn:disabled {\n  cursor: not-allowed;\n  opacity: .6;\n}\n.ec-market-panel .ec-main-content {\n  padding: 0 20px 0 24px;\n}\n.wbh-sortRow {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  height: 28px;\n  margin: 0 0 12px;\n}\n.wbh-filterRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 0;\n  flex-wrap: wrap;\n}\n.ec-market-panel .ec-category-tabs-wrap {\n  padding: 0;\n}\n.wbh-filterRow .ec-category-tabs-wrap {\n  padding: 0;\n}\n.wbh-viewBar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px var(--ec-page-gutter) 4px;\n}\n.wbh-viewTitle {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.wbh-btnCount {\n  display: inline-block;\n  margin-left: 5px;\n  font-size: 12px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-addWrap {\n  position: relative;\n  display: inline-flex;\n}\n.wbh-addScrim {\n  position: fixed;\n  inset: 0;\n  z-index: 6240;\n}\n.wbh-addMenu {\n  position: absolute;\n  top: calc(100% + 6px);\n  right: 0;\n  z-index: 6250;\n  min-width: 180px;\n  padding: 6px;\n  border: 1px solid var(--wb-border-default,#e5e5e5);\n  border-radius: 12px;\n  background: var(--wb-bg-primary,#fff);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .12);\n  animation: wbhPopIn .15s ease;\n}\n.wbh-addMenuItem {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  height: 34px;\n  padding: 0 10px;\n  border-radius: 8px;\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n  cursor: pointer;\n}\n.wbh-addMenuItem:hover {\n  background: var(--wb-bg-hover,#f5f5f5);\n}\n.wbh-installedCard {\n  position: relative;\n}\n.wbh-uninstallBtn {\n  position: absolute;\n  right: 10px;\n  bottom: 10px;\n  z-index: 2;\n}\n.wbh-picker-local {\n  padding: 6px 0 0;\n}\n.wbh-menu-item.is-open {\n  background: #f0f0f0;\n}\n.wbh-flyoutNotice {\n  position: absolute;\n  left: 0;\n  bottom: -26px;\n  z-index: 6251;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  white-space: nowrap;\n}\n.wbh-detailMeta {\n  margin: 12px 0 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.wbh-detailMeta > div {\n  display: flex;\n  gap: 12px;\n  font-size: 12px;\n}\n.wbh-detailMeta dt {\n  width: 70px;\n  color: var(--wb-color-text-tertiary);\n  margin: 0;\n}\n.wbh-detailMeta dd {\n  margin: 0;\n  color: var(--wb-color-text-primary);\n  word-break: break-all;\n}\n.wbh-flowBrand {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--wb-button-primary-fg);\n  background: var(--wb-avatar-bg-accent,#111);\n}\n.wbh-flowLine {\n  flex: 1;\n  height: 2px;\n  min-width: 24px;\n  background: var(--wb-border-default,#e5e5e5);\n  border-radius: 2px;\n}\n.wbh-detailName {\n  margin: 14px 0 6px;\n  font-size: 16px;\n  font-weight: 600;\n  text-align: center;\n  color: var(--wb-color-text-primary);\n}\n.wbh-detailDesc {\n  margin: 0 0 16px;\n  font-size: 13px;\n  line-height: 20px;\n  text-align: center;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-detailActions {\n  display: flex;\n  justify-content: center;\n}\n.wbh-notice {\n  padding: 6px 10px;\n  margin-bottom: 6px;\n  border-radius: 8px;\n  background: var(--wb-bg-tertiary,#f4f4f4);\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-notice--page {\n  margin: 8px var(--ec-page-gutter) 0;\n}\n.wbh-authLink {\n  display: inline-flex;\n  margin: 0 0 6px 8px;\n  padding: 6px 12px;\n  border-radius: 8px;\n  background: #eef4ff;\n  color: #1a56db;\n  font-size: 12px;\n  text-decoration: none;\n}\n.wbh-authLink:hover {\n  background: #e2ecff;\n}\n.wbh-authLink--page {\n  margin: 8px var(--ec-page-gutter) 0;\n}\n.ec-market-panel .ec-topbar {\n  height: 56px;\n  min-height: 56px;\n  padding: 0 24px;\n  margin: 0 0 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: transparent;\n}\n.ec-market-panel .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 0 0 auto;\n}\n.ec-market-panel .ec-topbar .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  height: 32px;\n  flex: 0 0 auto;\n  padding: 0;\n  border: none;\n  background: transparent;\n  border-radius: 0;\n  display: block;\n}\n.ec-market-panel .ec-topbar .wb-input-wrapper {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  width: 100%;\n  height: 32px;\n  padding: 0 8px;\n  box-sizing: border-box;\n  border-radius: 8px;\n  background: #f2f2f2;\n  border: 1px solid rgba(0, 0, 0, .08);\n}\n.ec-market-panel .ec-topbar .wb-input__prefix {\n  flex: 0 0 14px;\n  width: 14px;\n  height: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(0, 0, 0, .5);\n}\n.ec-market-panel .ec-topbar .wb-input__prefix svg {\n  display: block;\n  width: 14px;\n  height: 14px;\n}\n.ec-market-panel .ec-topbar .ec-search-wrapper input {\n  flex: 1 1 auto;\n  min-width: 0;\n  height: 30px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  outline: none;\n  background: transparent;\n  font-size: 16px;\n  line-height: normal;\n  color: #000;\n  font-family: inherit;\n}\n.ec-market-panel .ec-topbar .ec-search-wrapper input::placeholder {\n  color: rgba(0, 0, 0, .3);\n}\n.wbh-nativeRowBox {\n  margin: 12px 0 4px;\n}\n.wbh-nativeRow {\n  max-height: 220px;\n  overflow: auto;\n  margin: 0;\n  padding: 10px 12px;\n  border-radius: 10px;\n  background: var(--wb-bg-tertiary,#f6f6f6);\n  font-size: 11px;\n  line-height: 16px;\n  white-space: pre;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-nativeRowFoot {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 8px;\n}\n.wbh-nativeRowNote {\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-toolBox {\n  margin: 12px 0 4px;\n  text-align: left;\n}\n.wbh-toolHead {\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  margin-bottom: 6px;\n}\n.wbh-toolList {\n  max-height: 200px;\n  overflow: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.wbh-toolRow {\n  display: flex;\n  gap: 8px;\n  font-size: 11px;\n  line-height: 16px;\n}\n.wbh-toolRow code {\n  flex: 0 0 auto;\n  color: var(--wb-color-text-primary);\n  font-family: var(--font-mono,monospace);\n}\n.wbh-toolRow span {\n  color: var(--wb-color-text-tertiary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.wbh-toolMore {\n  margin-top: 6px;\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-sideEntry {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n}\n.wbh-sideEntryPop {\n  position: fixed;\n  z-index: 6400;\n  width: 162px;\n  padding: 8px;\n  box-sizing: border-box;\n  border-radius: 16px;\n  background: #fff;\n  border: 1px solid #f2f2f2;\n  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, .04), 0 3px 6px -8px rgba(0, 0, 0, .04);\n  font-size: 14px;\n  line-height: 22px;\n}\n.wbh-sideEntryList {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  width: 144px;\n}\n.wbh-sideEntryItem {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 5px 8px;\n  box-sizing: border-box;\n  border-radius: 8px;\n  cursor: pointer;\n  color: #333;\n  font-size: 14px;\n  line-height: 22px;\n}\n.wbh-sideEntryItem:hover {\n  background: #f0f0f0;\n}\n.wbh-sideEntryIcon {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(0, 0, 0, .7);\n}\n.wbh-sideEntryLabel {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-modal-card .ec-modal-scroll-fade {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 44px;\n  pointer-events: none;\n  opacity: 0;\n  z-index: 1;\n  transition: opacity .15s ease;\n}\n.ec-modal-card .ec-modal-scroll-fade-top {\n  top: 0;\n  background:\n    linear-gradient(\n      180deg,\n      #fff 0,\n      rgba(255, 255, 255, 0) 100%);\n}\n.ec-modal-card .ec-modal-scroll-fade-bottom {\n  bottom: 0;\n  background:\n    linear-gradient(\n      0deg,\n      #fff 0,\n      rgba(255, 255, 255, 0) 100%);\n}\n.connector-detail-modal .connector-detail-flow-avatar {\n  width: 68px;\n  height: 68px;\n}\n.connector-detail-modal .connector-detail-modal-body {\n  padding: 48px 0 24px;\n}\n.connector-detail-modal .connector-detail-close {\n  padding: 0;\n}\n.connector-detail-modal .connector-detail-flow {\n  gap: 12px;\n}\n.skills-view .ec-topbar--subpage {\n  height: 56px;\n  min-height: 56px;\n}\n.wbh-authCard--inline {\n  position: static;\n  width: 100%;\n  max-width: 420px;\n  margin: 0 auto;\n  padding: 20px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  box-shadow: none;\n  animation: none;\n}\n.wbh-authReason {\n  margin: 6px 0 0;\n  font-size: 12.5px;\n  line-height: 1.6;\n  color: var(--wb-color-text-primary);\n}\n.wbh-authExpired {\n  margin: 0 0 14px;\n  font-size: 13px;\n  color: #b26a00;\n}\n.wbh-authLink--block {\n  display: block;\n  width: 100%;\n  margin: 0 auto 8px;\n  text-align: center;\n}\n.wbh-loginGate {\n  display: flex;\n  justify-content: center;\n  padding: 28px var(--ec-page-gutter,24px);\n}\n.wbh-sourceNote {\n  margin: 0 0 10px;\n  padding: 6px 10px;\n  border-radius: 8px;\n  background: var(--wb-bg-tertiary,#f4f4f4);\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-accountWrap {\n  position: relative;\n  display: inline-flex;\n}\n.wbh-accountChip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 12px;\n  border: 1px solid var(--wb-border-default,#e5e5e5);\n  border-radius: 999px;\n  background: var(--wb-bg-secondary,#f7f7f7);\n  color: var(--wb-color-text-primary);\n  font: inherit;\n  font-size: 12px;\n  line-height: 1;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background-color .12s ease;\n}\n.wbh-accountChip:hover {\n  background: var(--wb-bg-hover,#f0f0f0);\n}\n.wbh-accountChip.is-on {\n  background: var(--wb-bg-primary,#fff);\n}\n.wbh-accountChip.is-loading {\n  cursor: default;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-accountChip.is-stale {\n  background: #fff7e6;\n  border-color: #ffd591;\n  color: #ad4e00;\n}\n.wbh-accountChip .wbh-dot {\n  flex: none;\n}\n.wbh-accountPop {\n  position: absolute;\n  top: calc(100% + 6px);\n  right: 0;\n  z-index: 6250;\n  min-width: 220px;\n  padding: 8px;\n  border: 1px solid var(--wb-border-default,#e5e5e5);\n  border-radius: 12px;\n  background: var(--wb-bg-primary,#fff);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .12);\n  animation: wbhPopIn .15s ease;\n}\n.wbh-accountRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 5px 8px;\n  font-size: 12px;\n  color: var(--wb-color-text-primary);\n}\n.wbh-accountLogout {\n  display: block;\n  width: 100%;\n  margin-top: 6px;\n  padding: 7px 10px;\n  border: 1px solid var(--wb-border-default,#e5e5e5);\n  border-radius: 8px;\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n.wbh-accountLogout:hover {\n  background: var(--wb-bg-hover,#f0f0f0);\n}\n.wbh-flyoutLogin {\n  height: auto;\n  min-height: 32px;\n  padding: 5px 8px;\n}\n.wbh-flyoutLogin .wbh-flyoutFooterLabel {\n  white-space: normal;\n  overflow: visible;\n  text-overflow: clip;\n  font-size: 12px;\n  line-height: 16px;\n}\n.wbh-flyoutLogin .wbh-flyoutFooterLabel,\n.wbh-flyoutLogin .wbh-flyoutFooterIcon {\n  color: var(--wb-palette-blue-1,#2f6bff);\n}\n.wbh-localMcpSection .wbh-muted {\n  display: block;\n  margin: 6px 0;\n  line-height: 1.7;\n}\n.wbh-localMcpRow {\n  flex-wrap: wrap;\n}\n.wbh-localMcpRow .wbh-installedName {\n  display: inline-flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.wbh-badgeIdle {\n  border-color: var(--wb-border-default);\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-localMcpForm {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  margin-top: 12px;\n  padding: 10px 0;\n  border-top: 1px solid var(--wb-border-default);\n}\n.wbh-localMcpInput {\n  height: 30px;\n  padding: 0 10px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  background: var(--wb-bg-primary);\n  color: var(--wb-color-text-primary);\n  font: inherit;\n  font-size: 12px;\n  min-width: 140px;\n}\n.wbh-localMcpInput:focus {\n  outline: none;\n  border-color: var(--wb-palette-blue-1,#2f6bff);\n}\n.wbh-localMcpUrl {\n  flex: 1 1 260px;\n}\n.wbh-localMcpToken {\n  flex: 1 1 200px;\n}\n.wbh-localMcpForm button[type=submit] {\n  flex: none;\n}\n.wbh-flyoutRow .wbh-toggle {\n  flex: 0 0 26px;\n}\n.wbh-flyoutRow .wbh-toggle:hover {\n  background: rgba(0, 0, 0, .12);\n}\n.wbh-flyoutRow .wbh-toggle.is-on:hover {\n  background: #00a55d;\n}\n.wbh-flyoutRow .wbh-toggle:focus-visible {\n  outline: 2px solid var(--wb-palette-blue-1,#2f6bff);\n  outline-offset: 1px;\n}\n.wbh-flyoutRow .wbh-toggle:disabled {\n  opacity: .5;\n  cursor: default;\n}\n.wbh-mcpSection {\n  padding: 2px 0 6px;\n  border-bottom: 1px solid var(--wb-border-subtle,rgba(0,0,0,.06));\n  margin-bottom: 4px;\n}\n.wbh-mcpSectionTitle {\n  padding: 2px 14px 4px;\n  font-size: 11px;\n  line-height: 16px;\n  color: var(--wb-color-text-tertiary,#999);\n}\n.wbh-flyoutRow.is-mcp {\n  cursor: default;\n}\n.wbh-flyoutRow.is-mcp .wbh-flyoutIcon.is-mcp {\n  border-radius: 4px;\n}\n.wbh-flyoutRow.is-mcp .wbh-flyoutName {\n  flex: 0 0 auto;\n}\n.wbh-mcpMeta {\n  flex: 0 1 auto;\n  min-width: 0;\n  text-align: right;\n  padding-right: 8px;\n  font-size: 11px;\n  line-height: 16px;\n  color: var(--wb-color-text-tertiary,#999);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.wbh-mcpBadge {\n  flex: 0 0 auto;\n  padding: 0 6px;\n  border: 1px solid var(--wb-border-default,rgba(0,0,0,.12));\n  border-radius: 4px;\n  font-size: 10px;\n  line-height: 18px;\n  color: var(--wb-color-text-tertiary,#999);\n}\n.wbh-marketModal {\n  width: min(1080px, 94vw);\n  height: min(720px, 88vh);\n  max-width: min(1080px, 94vw);\n  max-height: min(720px, 88vh);\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.wbh-marketModalHead {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--wb-border-subtle,rgba(0,0,0,.06));\n}\n.wbh-marketModalTitle {\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 22px;\n  color: var(--wb-color-text-primary);\n}\n.wbh-marketModalHint {\n  flex: 1 1 auto;\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--wb-color-text-tertiary,#999);\n}\n.wbh-marketModalClose {\n  padding: 0;\n}\n.wbh-marketModalNotice {\n  flex: 0 0 auto;\n  margin: 10px 16px 0;\n  padding: 6px 10px;\n  border-radius: 8px;\n  background: var(--wb-bg-tertiary,#f4f4f4);\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-marketModalBody {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 0 16px 16px;\n}\n[data-ds-dark-theme] .wbh-chipLabel,\n[data-ds-dark-theme] .cr-chip-label {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-chipClose,\n[data-ds-dark-theme] .cr-chip-icon {\n  color: #ffffff80;\n}\n[data-ds-dark-theme] .wbh-railChip:hover .wbh-chipLabel,\n[data-ds-dark-theme] .wbh-railChip:hover .wbh-chipClose,\n[data-ds-dark-theme] .wbh-railChip:focus-within .wbh-chipLabel {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-removeNotice {\n  border-color: #2e4a2e;\n  background: #12210f;\n  color: #8fd48f;\n}\n[data-ds-dark-theme] .wbh-badgeCurrent {\n  border-color: #2e4a2e;\n  background: #12210f;\n  color: #8fd48f;\n}\n[data-ds-dark-theme] .wbh-authLink {\n  background: #ffffff14;\n  color: #7ea6ff;\n}\n\n/* src/official-picker.css */\n.wbh-pickerLayer {\n  position: absolute;\n  left: 0;\n  bottom: calc(100% + 8px);\n  z-index: 6250;\n}\n.wbh-menu {\n  position: relative;\n  z-index: 1;\n  width: 200px;\n  padding: 8px;\n  border-radius: 16px;\n  background: #fff;\n  border: .5px solid rgba(0, 0, 0, .08);\n  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, .04), 0 3px 6px -8px rgba(0, 0, 0, .04);\n  user-select: none;\n  box-sizing: border-box;\n  outline: none !important;\n  animation: wbhAddPopIn .18s ease-out both;\n}\n@keyframes wbhAddPopIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n.wbh-menu-group {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.wbh-menu-divider {\n  height: 1px;\n  margin: 6px 4px;\n  background: #f2f2f2;\n}\n.wbh-menu-item {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  border-radius: 8px;\n  color: #333;\n  font-size: 14px;\n  line-height: 22px;\n  cursor: pointer;\n  transition: background-color .15s;\n  box-sizing: border-box;\n  font-family:\n    \"PingFang SC\",\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    sans-serif;\n}\n.wbh-menu-item:hover,\n.wbh-menu-item.is-open {\n  background: #f0f0f0;\n}\n.wbh-menu-item.is-open::after {\n  content: \"\";\n  position: absolute;\n  left: 100%;\n  top: -4px;\n  width: 20px;\n  height: max(140px, 100% + 96px);\n  pointer-events: auto;\n  z-index: 1;\n}\n.wbh-menu-item.is-empty {\n  color: rgba(26, 26, 26, .6);\n  font-size: 13px;\n  cursor: default;\n}\n.wbh-menu-item.is-empty:hover {\n  background: transparent;\n}\n.wbh-menu-icon {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #666;\n}\n.wbh-menu-icon svg {\n  width: 16px;\n  height: 16px;\n}\n.wbh-menu-avatar {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  overflow: hidden;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 9px;\n  line-height: 1;\n  font-weight: 600;\n}\n.wbh-menu-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.wbh-menu-name {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.wbh-menu-chevron {\n  flex: 0 0 14px;\n  width: 14px;\n  height: 14px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(26, 26, 26, .6);\n}\n.wbh-menu-chevron svg {\n  width: 14px;\n  height: 14px;\n}\n.wbh-flyoutWrap {\n  position: absolute;\n  left: 194px;\n  z-index: 1110;\n}\n.wbh-flyout {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  padding: 8px;\n  border-radius: 16px;\n  max-height: var(--wbh-maxh,none);\n  max-width: var(--wbh-maxw,none);\n  background: #fff;\n  border: .5px solid rgba(0, 0, 0, .08);\n  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, .04), 0 3px 6px -8px rgba(0, 0, 0, .04);\n  user-select: none;\n  z-index: 40;\n  outline: none !important;\n  font-family:\n    \"PingFang SC\",\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    sans-serif;\n}\n.wbh-flyout.is-expert {\n  width: 200px;\n  gap: 0;\n}\n.wbh-flyout.is-skill {\n  width: 320px;\n  gap: 0;\n  overflow: hidden;\n}\n.wbh-flyout.is-connector {\n  width: 240px;\n  gap: 8px;\n  max-height: min(392px, var(--wbh-maxh,392px));\n}\n.wbh-flyoutSearch {\n  flex: 0 0 32px;\n  display: flex;\n  align-items: center;\n  height: 32px;\n  padding: 0 8px;\n  gap: 8px;\n  border-radius: 8px;\n  background: #f7f7f7;\n  box-sizing: border-box;\n  color: #666;\n}\n.wbh-flyoutSearch .wbh-flyoutSearchIcon {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #666;\n}\n.wbh-flyoutSearch input {\n  flex: 1 1 auto;\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: none;\n  outline: none;\n  background: transparent;\n  height: 22px;\n  font-size: 14px;\n  line-height: 22px;\n  color: #333;\n  font-family:\n    \"PingFang SC\",\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    sans-serif;\n}\n.wbh-flyoutSearch input::placeholder {\n  color: rgba(0, 0, 0, .4);\n}\n.wbh-flyoutBody {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.wbh-flyout.is-expert .wbh-flyoutList {\n  max-height: 168px;\n}\n.wbh-flyout.is-skill .wbh-flyoutBody {\n  min-height: 160px;\n  margin-top: 8px;\n}\n.wbh-flyoutList {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-height: 0;\n  overflow-y: auto;\n  flex: 1 1 auto;\n}\n.wbh-flyout.is-skill .wbh-flyoutList {\n  flex: 0 1 auto;\n}\n.wbh-flyoutList::-webkit-scrollbar {\n  width: 4px;\n}\n.wbh-flyoutList::-webkit-scrollbar-track {\n  background: transparent;\n}\n.wbh-flyout.is-expert .wbh-flyoutList::-webkit-scrollbar-thumb,\n.wbh-flyout.is-connector .wbh-flyoutList::-webkit-scrollbar-thumb {\n  background: #c1c1c1;\n  border-radius: 2px;\n}\n.wbh-flyout.is-skill .wbh-flyoutList {\n  scrollbar-width: thin;\n  scrollbar-color: transparent transparent;\n}\n.wbh-flyout.is-skill .wbh-flyoutList::-webkit-scrollbar-thumb {\n  background: transparent;\n  border-radius: 12px;\n  transition: background-color .2s;\n}\n.wbh-flyout.is-skill:hover .wbh-flyoutList {\n  scrollbar-color: #c1c1c1 transparent;\n}\n.wbh-flyout.is-skill:hover .wbh-flyoutList::-webkit-scrollbar-thumb {\n  background: #c1c1c1;\n}\n.wbh-flyout.is-skill:hover .wbh-flyoutList::-webkit-scrollbar-thumb:hover {\n  background: #a8a8a8;\n}\n.wbh-flyoutRow {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  flex-shrink: 0;\n  padding: 0 8px;\n  border-radius: 8px;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n.wbh-flyoutRow:hover {\n  background: #f0f0f0;\n}\n.wbh-flyoutRow.is-disabled {\n  cursor: not-allowed;\n  opacity: .5;\n}\n.wbh-flyoutIcon {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n.wbh-flyoutIcon img {\n  width: 16px;\n  height: 16px;\n  border-radius: 3px;\n  object-fit: cover;\n  display: block;\n}\n.wbh-flyoutIcon svg,\n.wbh-flyoutIcon .ec-avatar-sq-fallback {\n  width: 16px;\n  height: 16px;\n  border-radius: 3px;\n}\n.wbh-flyoutIcon.is-round,\n.wbh-flyoutIcon.is-round img,\n.wbh-flyoutIcon.is-round svg,\n.wbh-flyoutIcon.is-round .ec-avatar-sq-fallback {\n  border-radius: 50%;\n}\n.wbh-flyoutName {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 14px;\n  line-height: 22px;\n  color: #333;\n}\n.wbh-flyoutRow.is-skill {\n  height: 52px;\n  padding: 4px 8px;\n  align-items: flex-start;\n  flex-shrink: 0;\n}\n.wbh-flyoutRow.is-skill .wbh-flyoutIcon {\n  margin-top: 3px;\n}\n.wbh-flyoutRow.is-skill .wbh-flyoutIcon img,\n.wbh-flyoutRow.is-skill .wbh-flyoutIcon .ec-avatar-sq-fallback,\n.wbh-flyoutRow.is-skill .wbh-flyoutIcon svg {\n  border-radius: 6px;\n}\n.wbh-flyoutRow.is-connector .wbh-flyoutIcon .ec-avatar-sq-fallback {\n  border-radius: 3px;\n}\n.wbh-rowBody {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  height: 42px;\n}\n.wbh-rowTitle {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  overflow: hidden;\n  white-space: nowrap;\n  font-size: 14px;\n  line-height: 22px;\n  color: #333;\n}\n.wbh-rowTitleText {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n}\n.wbh-rowDesc {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 12px;\n  line-height: 20px;\n  color: rgba(0, 0, 0, .5);\n}\n.wbh-flyout.is-skill .wbh-flyoutList {\n  max-height: min(320px, var(--wbh-maxh,320px));\n}\n.wbh-pinBtn {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  align-self: center;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  padding: 0;\n  color: rgba(26, 26, 26, .6);\n  opacity: 0;\n  transition: opacity .15s, color .15s;\n}\n.wbh-flyoutRow:hover .wbh-pinBtn {\n  opacity: 1;\n}\n.wbh-pinBtn.is-pinned {\n  opacity: 1;\n  color: #333;\n}\n.wbh-pinBtn:hover {\n  color: #333;\n}\n.wbh-pinBtn svg {\n  width: 16px;\n  height: 16px;\n}\n.wbh-pinBtn .wbh-pinHover {\n  display: none;\n}\n.wbh-flyoutRow:hover .wbh-pinBtn.is-pinned .wbh-pinRest {\n  display: none;\n}\n.wbh-flyoutRow:hover .wbh-pinBtn.is-pinned .wbh-pinHover {\n  display: inline-flex;\n}\n.wbh-linkAction {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  user-select: none;\n}\n.wbh-linkAction svg {\n  flex: 0 0 14px;\n  width: 14px;\n  height: 14px;\n  display: block;\n  color: #666;\n}\n.wbh-linkAction span {\n  font-size: 12px;\n  line-height: 22px;\n  color: #666;\n}\n.wbh-flyoutRow:hover .wbh-linkAction svg,\n.wbh-flyoutRow:hover .wbh-linkAction span {\n  color: #333;\n}\n.wbh-toggle {\n  flex: 0 0 26px;\n  width: 26px;\n  height: 16px;\n  border-radius: 999px;\n  background: #ddd;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  position: relative;\n  transition: all .2s cubic-bezier(.38, 0, .24, 1) !important;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n}\n.wbh-toggle i {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  transform: translateX(0);\n  transition: all .2s cubic-bezier(.38, 0, .24, 1);\n  will-change: transform;\n}\n.wbh-toggle.is-on {\n  background: #00b96b;\n}\n.wbh-toggle.is-on i {\n  transform: translateX(10px);\n}\n.wbh-toggle:hover {\n  background: #c6c6c6;\n}\n.wbh-toggle.is-on:hover {\n  background: #00a55d;\n}\n.wbh-toggle:disabled {\n  cursor: not-allowed;\n  opacity: .5;\n}\n.wbh-toggle:disabled:hover {\n  background: #ddd;\n}\n.wbh-toggle.is-on:disabled:hover {\n  background: #00b96b;\n}\n.wbh-flyoutBusy {\n  font-size: 12px;\n  line-height: 22px;\n  color: rgba(26, 26, 26, .6);\n  flex: 0 0 auto;\n}\n.wbh-flyoutDivider {\n  flex: 0 0 1px;\n  height: 1px;\n  background: #f2f2f2;\n}\n.wbh-flyout.is-expert .wbh-flyoutDivider {\n  margin: 8px 0;\n}\n.wbh-flyoutFooter {\n  flex: 0 0 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.wbh-flyout.is-skill .wbh-flyoutFooter {\n  margin-top: 8px;\n}\n.wbh-flyoutFooterItem {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  border-radius: 8px;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n.wbh-flyoutFooterItem:hover {\n  background: #f0f0f0;\n}\n.wbh-flyoutFooterIcon {\n  flex: 0 0 16px;\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #666;\n}\n.wbh-flyoutFooterIcon svg {\n  width: 16px;\n  height: 16px;\n}\n.wbh-flyoutFooterLabel {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 14px;\n  line-height: 22px;\n  color: #333;\n}\n.wbh-flyoutState {\n  padding: 12px 8px;\n  font-size: 13px;\n  line-height: 20px;\n  color: #666;\n  text-align: center;\n}\n[data-ds-dark-theme] .wbh-menu {\n  background: #242424;\n  border-color: #ffffff14;\n  box-shadow: 0 4px 12px -4px #0006, 0 3px 6px -8px #0006;\n}\n[data-ds-dark-theme] .wbh-menu-item {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-menu-item:hover,\n[data-ds-dark-theme] .wbh-menu-item.is-open {\n  background: #ffffff14;\n}\n[data-ds-dark-theme] .wbh-menu-item.is-empty {\n  color: #ffffff80;\n}\n[data-ds-dark-theme] .wbh-menu-item.is-empty:hover {\n  background: transparent;\n}\n[data-ds-dark-theme] .wbh-menu-icon {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-menu-chevron {\n  color: #ffffff80;\n}\n[data-ds-dark-theme] .wbh-flyoutSearch {\n  background: #ffffff14;\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-flyoutSearch .wbh-flyoutSearchIcon {\n  color: #ffffff80;\n}\n[data-ds-dark-theme] .wbh-flyoutSearch input {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-flyoutSearch input::placeholder {\n  color: #ffffff66;\n}\n[data-ds-dark-theme] .wbh-flyoutName,\n[data-ds-dark-theme] .wbh-rowTitle {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-rowDesc {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-pinBtn {\n  color: #ffffff80;\n}\n[data-ds-dark-theme] .wbh-pinBtn.is-pinned,\n[data-ds-dark-theme] .wbh-pinBtn:hover {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-linkAction svg,\n[data-ds-dark-theme] .wbh-linkAction span {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-flyoutRow:hover .wbh-linkAction svg,\n[data-ds-dark-theme] .wbh-flyoutRow:hover .wbh-linkAction span {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-flyoutBusy,\n[data-ds-dark-theme] .wbh-flyoutState,\n[data-ds-dark-theme] .wbh-flyoutFooterIcon,\n[data-ds-dark-theme] .wbh-flyoutFooterLabel {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .wbh-flyoutFooterItem:hover {\n  background: #ffffff14;\n}\n[data-ds-dark-theme] .ec-avatar-sq-fallback {\n  background: #ffffff1a !important;\n  color: #ffffffe6 !important;\n}\n[data-ds-dark-theme] .cr-connectors-submenu__suffix-connect {\n  background: transparent;\n}\n[data-ds-dark-theme] .cr-connectors-submenu__suffix-connect-label {\n  color: #ffffffe6;\n}\n[data-ds-dark-theme] .cr-connectors-submenu__suffix-connect-icon {\n  color: #ffffff99;\n}\n[data-ds-dark-theme] .cr-connectors-submenu__item:hover .cr-connectors-submenu__suffix-connect-label,\n[data-ds-dark-theme] .cr-connectors-submenu__item:hover .cr-connectors-submenu__suffix-connect-icon {\n  color: #ffffffff;\n}\n\n/* src/cr-idle-light.css */\n.wbh-port {\n  --cb-bg-color-container: var(--cb-vscode-editor-background,#fff);\n  --cb-vscode-editor-background: var(--vscode-editor-background,#fff);\n  --idle-cap-accent-text: #000000b3;\n  --idle-cap-card-border: #ebebeb;\n  --vscode-editor-background: #fff;\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 5%, transparent);\n  --wb-border-default: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-button-primary-fg: var(--wb-palette-white-100);\n  --wb-color-bg-primary-default: var(--wb-palette-gray-3);\n  --wb-color-bg-secondary-hover-active: var(--wb-palette-gray-2);\n  --wb-color-text-primary: var(--wb-palette-black-100);\n  --wb-color-text-tertiary: var(--wb-palette-black-50);\n  --wb-palette-black-100: #000;\n  --wb-palette-black-50: #00000080;\n  --wb-palette-brand-blue: #0052d9;\n  --wb-palette-gray-2: #f7f7f7;\n  --wb-palette-gray-3: #f2f2f2;\n  --wb-palette-white-100: #fff;\n  --wb-text-link-brand: var(--wb-palette-brand-blue);\n}\n.wbh-port .idle-capability-toast__manage-link {\n  font: inherit;\n  color: var(--wb-text-link-brand);\n  cursor: pointer;\n  background: 0 0;\n  border: none;\n  margin: 0 2px;\n  padding: 0;\n  display: inline;\n}\n.wbh-port .idle-capability-toast__manage-link:hover {\n  text-decoration: underline;\n}\n.wbh-port .idle-capability-pill {\n  z-index: 900;\n  box-sizing: border-box;\n  --idle-cap-accent-text:#000000b3;\n  --idle-cap-card-border:#ebebeb;\n  background: var(--cb-bg-color-container,#fff);\n  border: .5px solid var(--idle-cap-card-border);\n  border-radius: 24px;\n  flex-direction: column;\n  gap: 12px;\n  width: 360px;\n  max-width: calc(100vw - 32px);\n  padding: 20px;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    PingFang SC,\n    Segoe UI,\n    sans-serif;\n  display: flex;\n  position: fixed;\n  top: 50px;\n  right: 20px;\n  overflow: hidden;\n  box-shadow: 0 8px 48px #00000014, 0 6px 12px #0000000a;\n}\n.wbh-port .idle-capability-pill__close {\n  width: 20px;\n  height: 20px;\n  color: var(--wb-text-tertiary);\n  cursor: pointer;\n  -webkit-app-region: no-drag;\n  background: 0 0;\n  border: none;\n  border-radius: 4px;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  font-size: 12px;\n  line-height: 1;\n  display: flex;\n  position: absolute;\n  top: 21px;\n  right: 20px;\n}\n.wbh-port .idle-capability-pill__close:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-text-secondary);\n}\n.wbh-port .idle-capability-pill__title {\n  color: var(--wb-text-primary);\n  word-break: break-word;\n  padding-right: 24px;\n  font-size: 16px;\n  font-weight: 600;\n  line-height: 1.5;\n}\n.wbh-port .idle-capability-pill__body {\n  color: var(--wb-color-text-tertiary);\n  word-break: break-word;\n  margin-top: -4px;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.wbh-port .idle-capability-pill__manage-link {\n  font: inherit;\n  color: var(--wb-color-text-primary);\n  cursor: pointer;\n  background: 0 0;\n  border: none;\n  margin: 0 2px;\n  padding: 0;\n  display: inline;\n}\n.wbh-port .idle-capability-pill__manage-link:hover {\n  text-decoration: underline;\n}\n.wbh-port .idle-capability-pill__detail-link {\n  min-width: 0;\n  color: var(--wb-color-text-tertiary);\n  cursor: pointer;\n  background: 0 0;\n  border: none;\n  align-items: center;\n  gap: 4px;\n  margin-right: auto;\n  padding: 0;\n  font-size: 14px;\n  line-height: 1.4;\n  display: inline-flex;\n}\n.wbh-port .idle-capability-pill__detail-link > span:first-child {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n.wbh-port .idle-capability-pill__detail-link:hover {\n  opacity: .75;\n}\n.wbh-port .idle-capability-pill__detail-caret {\n  width: 10px;\n  height: 10px;\n  color: inherit;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  display: inline-flex;\n}\n.wbh-port .idle-capability-pill__detail-caret svg {\n  opacity: .5;\n  width: 100%;\n  height: auto;\n  display: block;\n}\n.wbh-port .idle-capability-pill__detail-caret--up svg {\n  transform: rotate(180deg);\n}\n.wbh-port .idle-capability-pill__actions {\n  align-items: center;\n  gap: 12px;\n  margin-top: 4px;\n  display: flex;\n}\n.wbh-port .idle-capability-pill__select-row {\n  justify-content: space-between;\n  align-items: center;\n  margin-top: -2px;\n  display: flex;\n}\n.wbh-port .idle-capability-pill__select-count {\n  color: var(--idle-cap-accent-text);\n  font-size: 14px;\n}\n.wbh-port .idle-capability-pill__list {\n  border: 1px solid var(--wb-color-bg-secondary-hover-active);\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  background: 0 0;\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 0;\n  max-height: 248px;\n  padding: 0;\n  display: flex;\n  overflow: hidden auto;\n}\n.wbh-port .idle-capability-pill__list::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n  display: none;\n}\n.wbh-port .idle-capability-pill__list .cb-checkbox__box {\n  border-color: var(--wb-border-default,#00000040);\n  border-radius: 5px;\n}\n.wbh-port .idle-capability-pill__list .cb-checkbox--checked .cb-checkbox__box {\n  background: #000000bf;\n  border-color: #000000bf;\n}\n.wbh-port .idle-capability-pill__list .cb-checkbox--checked .cb-checkbox__box:after {\n  border-color: var(--wb-button-primary-fg,#fff);\n  border-width: 0 1.8px 1.8px 0;\n  width: 4px;\n  height: 8px;\n  top: 47%;\n  left: 50%;\n}\n.wbh-port .idle-capability-pill__list-row {\n  cursor: pointer;\n  flex-shrink: 0;\n  align-items: center;\n  gap: 9px;\n  min-width: 0;\n  height: 36px;\n  padding: 0 8px;\n  display: flex;\n  position: relative;\n}\n.wbh-port .idle-capability-pill__list-row:hover {\n  background: var(--wb-color-bg-primary-default);\n}\n.wbh-port .idle-capability-pill__list-name {\n  color: var(--wb-color-text-primary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  min-width: 0;\n  font-size: 14px;\n  font-weight: 400;\n  overflow: hidden;\n}\n.wbh-port .idle-capability-pill__list-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--wb-text-tertiary);\n  flex-shrink: 0;\n}\n.wbh-port .idle-capability-pill__list-date {\n  text-align: right;\n  width: 88px;\n  color: var(--wb-color-text-tertiary);\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  flex-shrink: 0;\n  font-size: 14px;\n  line-height: 1.4;\n  overflow: hidden;\n}\n.wbh-port .idle-capability-pill__list-head {\n  background: var(--wb-color-bg-secondary-hover-active);\n  flex-shrink: 0;\n  align-items: center;\n  gap: 9px;\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n  position: relative;\n}\n.wbh-port .idle-capability-pill__list-head-name {\n  min-width: 0;\n  color: var(--wb-color-text-tertiary);\n  flex: 1;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1.4;\n}\n.wbh-port .idle-capability-pill__list-head-date {\n  text-align: right;\n  width: 88px;\n  color: var(--wb-color-text-tertiary);\n  white-space: nowrap;\n  flex-shrink: 0;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1.4;\n}\n.wbh-port .idle-capability-pill__tooltip {\n  flex-direction: column;\n  gap: 4px;\n  max-width: 280px;\n  display: flex;\n}\n.wbh-port .idle-capability-pill__tooltip-name {\n  word-break: break-word;\n  white-space: normal;\n  font-size: 12px;\n  line-height: 1.45;\n}\n.wbh-port .idle-capability-pill__tooltip-meta {\n  opacity: .75;\n  font-size: 11px;\n  line-height: 1.4;\n}\n.wbh-port @media (width<=640px) {\n  .idle-capability-pill {\n    display: none;\n  }\n}\n\n/* src/cr-idle-dark.css */\n[data-ds-dark-theme] .wbh-port {\n  --cb-bg-color-container: var(--cb-vscode-editor-background,#1e1e1e);\n  --cb-vscode-editor-background: var(--vscode-editor-background,#1e1e1e);\n  --idle-cap-accent-text: #ffffff80;\n  --idle-cap-card-border: #3d3d3d;\n  --vscode-editor-background: #181818;\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-white-100) 6%, transparent);\n  --wb-border-default: color-mix(in srgb, var(--wb-palette-white-100) 14%, transparent);\n  --wb-button-primary-fg: var(--wb-palette-black-90);\n  --wb-color-bg-primary-default: var(--wb-palette-gray-3);\n  --wb-color-bg-secondary-hover-active: var(--wb-palette-gray-2);\n  --wb-color-text-primary: #fff;\n  --wb-color-text-tertiary: #ffffff80;\n  --wb-palette-black-90: #000000e6;\n  --wb-palette-brand-blue: #4d80ef;\n  --wb-palette-gray-2: #292929;\n  --wb-palette-gray-3: #1f1f1f;\n  --wb-palette-white-100: #fff;\n  --wb-text-link-brand: var(--wb-palette-brand-blue);\n}\n[data-ds-dark-theme] .wbh-port .idle-capability-pill {\n  --idle-cap-card-border:#3d3d3d;\n  --idle-cap-accent-text:#ffffff80;\n  box-shadow: 0 24px 48px -4px #0003, 0 6px 12px -8px #0003;\n}\n[data-ds-dark-theme] .wbh-port .idle-capability-pill .idle-capability-pill__list .cb-checkbox--checked .cb-checkbox__box {\n  background: #ffffffe6;\n  border-color: #ffffffe6;\n}\n[data-ds-dark-theme] .wbh-port .idle-capability-pill .idle-capability-pill__list .cb-checkbox--checked .cb-checkbox__box:after {\n  border-color: #1a1a1a;\n}\n\n/* src/cr-idle.patch.css */\n.wbh-port .cb-checkbox {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.wbh-port .cb-checkbox__box {\n  box-sizing: border-box;\n  position: relative;\n  width: 16px;\n  height: 16px;\n  border: 1px solid var(--wb-border-default, #00000040);\n  border-radius: 5px;\n  background: transparent;\n  transition: background 120ms ease, border-color 120ms ease;\n}\n.wbh-port .cb-checkbox__box::after {\n  content: \"\";\n  position: absolute;\n  top: 47%;\n  left: 50%;\n  width: 4px;\n  height: 8px;\n  border: solid var(--wb-button-primary-fg, #fff);\n  border-width: 0 1.8px 1.8px 0;\n  transform: translate(-50%, -50%) rotate(45deg) scale(0);\n  transform-origin: center;\n  transition: transform 120ms ease;\n}\n.wbh-port .cb-checkbox--checked .cb-checkbox__box {\n  background: #000000bf;\n  border-color: #000000bf;\n}\n.wbh-port .cb-checkbox--checked .cb-checkbox__box::after {\n  transform: translate(-50%, -50%) rotate(45deg) scale(1);\n}\n.wbh-port .cb-checkbox:focus-visible .cb-checkbox__box {\n  outline: 2px solid var(--cr-border-focus, #4d80ef);\n  outline-offset: 1px;\n}\n.wbh-port .wbh-idle-btn {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 32px;\n  padding: 0 12px;\n  border-radius: 8px;\n  border: 1px solid transparent;\n  font-size: 14px;\n  line-height: 1;\n  cursor: pointer;\n  transition:\n    background 120ms ease,\n    border-color 120ms ease,\n    opacity 120ms ease;\n  white-space: nowrap;\n}\n.wbh-port .wbh-idle-btn--secondary {\n  background: transparent;\n  border-color: var(--wb-border-default, #00000014);\n  color: var(--wb-color-text-primary);\n}\n.wbh-port .wbh-idle-btn--secondary:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n}\n.wbh-port .wbh-idle-btn--primary {\n  background: var(--wb-color-text-primary);\n  color: var(--cb-bg-color-container, #fff);\n}\n.wbh-port .wbh-idle-btn--primary:hover:not(:disabled) {\n  opacity: .82;\n}\n.wbh-port .wbh-idle-btn:disabled {\n  opacity: .42;\n  cursor: default;\n}\n.wbh-port .idle-capability-pill {\n  box-sizing: border-box;\n}\n.wbh-port .idle-capability-toast {\n  position: fixed;\n  left: 50%;\n  bottom: 32px;\n  transform: translateX(-50%);\n  z-index: 901;\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 2px;\n  max-width: calc(100vw - 32px);\n  padding: 10px 16px;\n  border-radius: 12px;\n  font-size: 13px;\n  line-height: 1.5;\n  color: #000000e6;\n  background: #fff;\n  border: .5px solid #ebebeb;\n  box-shadow: 0 8px 48px #00000014, 0 6px 12px #0000000a;\n}\n[data-ds-dark-theme] .wbh-port .idle-capability-toast,\n.wbh-port[data-ds-dark-theme] .idle-capability-toast {\n  color: #ffffffe6;\n  background: #181818;\n  border-color: #3d3d3d;\n  box-shadow: 0 24px 48px -4px #0003, 0 6px 12px -8px #0003;\n}\n";
try { var __st = document.createElement('style'); __st.setAttribute('data-workbuddy-hub',''); __st.textContent = __wbCss; document.head.appendChild(__st); } catch (e) {}

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
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

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module2) {
    module2.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module2) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module2.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module2) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module2.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module3 = data.get(row, col);
          if (module3 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module3;
            sameCountCol = 1;
          }
          module3 = data.get(col, row);
          if (module3 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module3;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module2) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module2.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric2 = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric2, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric2 + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module2) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module2.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module2) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module2.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module2) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module2.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module2) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module2.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module2) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module2 !== "undefined") {
      module2.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/index.jsx
var import_react14 = __toESM(require("react"), 1);

// src/picker-icons.js
var import_react = __toESM(require("react"), 1);
var RAW = {
  tabConnector: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="wb-icon" aria-hidden="true"><path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path></svg>',
  tabSkill: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="wb-icon" aria-hidden="true"><path fill="currentColor" transform="matrix(1 0 0 1 0.48584 0.198341)" d="M4.6062 4.6186C4.7017 4.6532 4.7748 4.6796 4.8254 4.6982C5.4214 4.9159 5.995 5.1566 6.5463 5.4213L0.59 11.3778C0.1967 11.7709 0 12.2455 0 12.8022C0 13.3583 0.1967 13.8329 0.59 14.226C0.9833 14.6195 1.458 14.8163 2.0142 14.8163C2.5704 14.8163 3.0452 14.6195 3.4385 14.226L8.8444 8.8202L7.9958 7.9716L2.59 13.3778C2.431 13.5365 2.239 13.6161 2.0142 13.6161C1.7894 13.6161 1.5974 13.5365 1.4385 13.3778C1.2795 13.2187 1.2 13.0268 1.2 12.8022C1.2 12.577 1.2795 12.3852 1.4385 12.226L7.6602 6.0048C8.4607 6.4613 9.2085 6.973 9.9038 7.5404C11.526 8.8637 12.6401 10.3251 13.2462 11.9247C13.3011 12.0834 13.406 12.1947 13.5609 12.2592C13.7118 12.3324 13.8647 12.3373 14.0199 12.2733C14.136 12.2313 14.2288 12.1591 14.2985 12.057C14.3706 11.9569 14.407 11.8451 14.4072 11.7216C14.4418 9.4774 13.7079 7.3163 12.2057 5.2372C10.7145 3.1732 8.734 1.5644 6.264 0.4106C5.8638 0.2235 5.5808 0.1068 5.415 0.0609C5.0775 -0.0333 4.7667 -0.0182 4.4825 0.1059C4.2285 0.2167 4.0161 0.4198 3.8452 0.7162C3.762 0.8603 3.6353 1.1381 3.4651 1.5497L3.4637 1.5526L3.4221 1.6537C3.4137 1.6737 3.4014 1.704 3.3849 1.7436C3.1986 2.1937 3.083 2.5082 3.0381 2.6874C2.9459 3.0561 2.9677 3.3808 3.1034 3.6625C3.2231 3.9105 3.4406 4.1156 3.7555 4.2768C3.9059 4.3539 4.1896 4.4677 4.6062 4.6186ZM10.6624 6.6103C9.0975 5.3339 7.2891 4.3207 5.2372 3.5707C5.1853 3.5521 5.1111 3.5248 5.0144 3.4901C4.48 3.2968 4.2032 3.1806 4.1843 3.141C4.1559 3.0819 4.2589 2.7694 4.4937 2.2025C4.5101 2.163 4.5226 2.1327 4.5311 2.1122L4.5728 2.0111L4.5741 2.0082C4.787 1.4931 4.9164 1.2255 4.9625 1.2055C5.0206 1.1801 5.2852 1.2777 5.7561 1.4975C8.0378 2.5639 9.8635 4.0448 11.233 5.9398C11.8647 6.8144 12.345 7.7011 12.6737 8.601C12.1068 7.9052 11.4364 7.2421 10.6624 6.6103ZM10.0311 10.4843C9.9585 10.223 9.5796 10.2484 9.4539 10.5229L8.8284 11.8896C8.7889 11.9755 8.7157 12.0463 8.6287 12.0829L7.2451 12.664C6.9677 12.7807 6.9302 13.1601 7.1879 13.2421L8.4729 13.6479C8.5541 13.6737 8.6138 13.7357 8.6366 13.8183L8.998 15.1195C9.0707 15.3808 9.4496 15.3554 9.5753 15.081L10.2008 13.7143C10.2404 13.6283 10.3135 13.5575 10.4006 13.5209L11.7831 12.9398C12.0609 12.8231 12.0984 12.4433 11.8403 12.3617L10.5562 11.956C10.4752 11.9301 10.4155 11.8686 10.3926 11.7865L10.0311 10.4843Z" fill-rule="evenodd"></path></svg>',
  tabExpert: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="wb-icon" aria-hidden="true"><path fill="currentColor" transform="matrix(1 0 0 1 1.36963 0.768944)" d="M7.1035 0C8.6643 0 10.7053 0.0099 12.0742 1.5205C13.2979 2.8714 13.3086 4.7621 13.3086 6.1885L13.3086 8.1777C13.3086 10.1172 12.4294 11.8523 11.0498 13.004C8.8995 14.7989 5.3968 15.0938 3.2227 13.0078C2.3428 12.1634 1.8536 11.0199 1.7246 9.7939C0.8046 9.5348 0.112 8.7337 0.0127 7.7568L0 7.5146C0.0001 6.2068 1.0603 5.1465 2.3682 5.1465L2.6104 5.1592C3.6191 5.2617 4.4383 5.9978 4.6689 6.9629L5.6562 6.9629C5.9052 5.9216 6.8394 5.1465 7.957 5.1465L8.1992 5.1592C9.3932 5.2805 10.3251 6.2887 10.3252 7.5146L10.3125 7.7568C10.1912 8.9509 9.1831 9.8828 7.957 9.8828L7.7148 9.8701C6.7393 9.7711 5.939 9.0803 5.6787 8.1621L4.6445 8.1621C4.4136 8.9759 3.7594 9.6106 2.9346 9.8134C3.0599 10.7423 3.4425 11.555 4.0537 12.1416C5.6974 13.7188 8.498 13.5697 10.2803 12.0821C11.3984 11.1486 12.1084 9.7464 12.1084 8.1777L12.1084 6.1885C12.1084 4.677 12.0504 3.281 11.1856 2.3262C10.2269 1.2683 8.7608 1.1992 7.1035 1.1992C5.2192 1.1992 3.708 1.2459 2.6699 1.292C2.179 1.3138 1.7933 1.3357 1.5244 1.3525C1.4552 1.8424 1.5142 2.1892 1.625 2.4326C1.7619 2.733 2.0131 2.9569 2.3867 3.1113C3.1734 3.4364 4.3684 3.392 5.4512 3.1201L5.7441 4.2842C4.5613 4.5812 3.0644 4.6898 1.9287 4.2207C1.3415 3.978 0.8226 3.567 0.5322 2.9297C0.2457 2.2999 0.2194 1.5309 0.4434 0.6396L0.4736 0.5488C0.5603 0.3473 0.7528 0.2058 0.9766 0.1875L0.9785 0.1875C0.9785 0.1875 0.9822 0.1867 0.9844 0.1865C0.9892 0.1862 0.997 0.1862 1.0059 0.1855C1.0243 0.1841 1.0517 0.1813 1.0869 0.1787C1.1586 0.1735 1.265 0.166 1.4033 0.1572C1.6808 0.1396 2.0904 0.1162 2.6172 0.0928C3.6711 0.046 5.1999 0 7.1035 0ZM2.3682 6.3467C1.7231 6.3467 1.2003 6.8696 1.2002 7.5146C1.2002 8.1598 1.723 8.6826 2.3682 8.6826C3.0133 8.6826 3.5361 8.1598 3.5361 7.5146C3.5361 6.8696 3.0132 6.3467 2.3682 6.3467ZM7.957 6.3467C7.312 6.3467 6.7892 6.8696 6.7891 7.5146C6.7891 8.1598 7.3119 8.6826 7.957 8.6826C8.6021 8.6825 9.125 8.1598 9.125 7.5146C9.1249 6.8697 8.602 6.3468 7.957 6.3467Z" fill-rule="evenodd"></path></svg>',
  searchFilled: '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="wb-icon" aria-hidden="true"><path transform="matrix(1 0 0 1 0.694254 0.694255)" fill-rule="evenodd" d="M1.3646 9.8956Q2.0746 10.8983 3.1116 11.5182Q4.1346 12.1607 5.3503 12.3381Q7.2619 12.6647 9.0751 11.7409L8.5303 10.6717Q7.4402 11.2271 6.3057 11.2198L6.3057 11.2057Q5.9108 11.2057 5.5384 11.1514Q5.1673 11.088 4.7916 10.9659Q4.2218 10.7808 3.74 10.4928Q3.2646 10.1942 2.8409 9.7706Q2.5616 9.4912 2.3366 9.1893Q2.1191 8.8821 1.9398 8.5303Q1.6678 7.9965 1.5308 7.4521Q1.4058 6.9048 1.4058 6.3057Q1.4058 5.9108 1.4601 5.5385Q1.5235 5.1673 1.6456 4.7916Q1.8307 4.2218 2.1187 3.7399Q2.4173 3.2645 2.8409 2.8409Q3.1203 2.5615 3.4222 2.3366Q3.7294 2.1191 4.0812 1.9398Q4.615 1.6678 5.1594 1.5308Q5.7067 1.4057 6.3057 1.4058Q6.7006 1.4057 7.073 1.4601Q7.4442 1.5235 7.8199 1.6456Q8.3897 1.8307 8.8716 2.1187Q9.347 2.4173 9.7706 2.8409Q10.0499 3.1203 10.2749 3.4222Q10.4924 3.7293 10.6717 4.0812L10.6842 4.0748Q11.2057 5.0823 11.2057 6.3057Q11.2057 7.8337 10.3414 9.0858Q10.2978 9.1489 10.2187 9.2616Q9.7975 9.8616 9.8001 10.1951Q9.8029 10.5402 10.0492 10.8638Q10.1573 11.0058 10.4777 11.3262L13.8815 14.73L14.73 13.8815L11.3262 10.4777Q11.1239 10.2754 11.0423 10.1828Q11.095 10.1019 11.2009 9.951Q11.2826 9.8346 11.3289 9.7675Q12.4057 8.2077 12.4058 6.3057Q12.4057 4.2708 11.2469 2.7159Q10.5369 1.7132 9.4999 1.0933Q8.4769 0.4508 7.2612 0.2734Q6.0501 0.0665 4.8786 0.3614Q3.7009 0.6305 2.7159 1.3646Q1.7132 2.0746 1.0933 3.1116Q0.4508 4.1346 0.2734 5.3504Q0.0665 6.5614 0.3614 7.7329Q0.6305 8.9106 1.3646 9.8956Z"></path></svg>',
  menuChevron: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3.5 9 7l-4 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  menuExpert: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.36963 0.768944)" d="M7.1035 0C8.6643 0 10.7053 0.0099 12.0742 1.5205C13.2979 2.8714 13.3086 4.7621 13.3086 6.1885L13.3086 8.1777C13.3086 10.1172 12.4294 11.8523 11.0498 13.004C8.8995 14.7989 5.3968 15.0938 3.2227 13.0078C2.3428 12.1634 1.8536 11.0199 1.7246 9.7939C0.8046 9.5348 0.112 8.7337 0.0127 7.7568L0 7.5146C0.0001 6.2068 1.0603 5.1465 2.3682 5.1465L2.6104 5.1592C3.6191 5.2617 4.4383 5.9978 4.6689 6.9629L5.6562 6.9629C5.9052 5.9216 6.8394 5.1465 7.957 5.1465L8.1992 5.1592C9.3932 5.2805 10.3251 6.2887 10.3252 7.5146L10.3125 7.7568C10.1912 8.9509 9.1831 9.8828 7.957 9.8828L7.7148 9.8701C6.7393 9.7711 5.939 9.0803 5.6787 8.1621L4.6445 8.1621C4.4136 8.9759 3.7594 9.6106 2.9346 9.8134C3.0599 10.7423 3.4425 11.555 4.0537 12.1416C5.6974 13.7188 8.498 13.5697 10.2803 12.0821C11.3984 11.1486 12.1084 9.7464 12.1084 8.1777L12.1084 6.1885C12.1084 4.677 12.0504 3.281 11.1856 2.3262C10.2269 1.2683 8.7608 1.1992 7.1035 1.1992C5.2192 1.1992 3.708 1.2459 2.6699 1.292C2.179 1.3138 1.7933 1.3357 1.5244 1.3525C1.4552 1.8424 1.5142 2.1892 1.625 2.4326C1.7619 2.733 2.0131 2.9569 2.3867 3.1113C3.1734 3.4364 4.3684 3.392 5.4512 3.1201L5.7441 4.2842C4.5613 4.5812 3.0644 4.6898 1.9287 4.2207C1.3415 3.978 0.8226 3.567 0.5322 2.9297C0.2457 2.2999 0.2194 1.5309 0.4434 0.6396L0.4736 0.5488C0.5603 0.3473 0.7528 0.2058 0.9766 0.1875L0.9785 0.1875C0.9785 0.1875 0.9822 0.1867 0.9844 0.1865C0.9892 0.1862 0.997 0.1862 1.0059 0.1855C1.0243 0.1841 1.0517 0.1813 1.0869 0.1787C1.1586 0.1735 1.265 0.166 1.4033 0.1572C1.6808 0.1396 2.0904 0.1162 2.6172 0.0928C3.6711 0.046 5.1999 0 7.1035 0ZM2.3682 6.3467C1.7231 6.3467 1.2003 6.8696 1.2002 7.5146C1.2002 8.1598 1.723 8.6826 2.3682 8.6826C3.0133 8.6826 3.5361 8.1598 3.5361 7.5146C3.5361 6.8696 3.0132 6.3467 2.3682 6.3467ZM7.957 6.3467C7.312 6.3467 6.7892 6.8696 6.7891 7.5146C6.7891 8.1598 7.3119 8.6826 7.957 8.6826C8.6021 8.6825 9.125 8.1598 9.125 7.5146C9.1249 6.8697 8.602 6.3468 7.957 6.3467Z"></path></svg>',
  menuSkill: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 0.485779 0.117911)" d="M4.6063 4.6987Q4.7494 4.7505 4.8255 4.7783Q5.7193 5.1048 6.5463 5.5015L0.59 11.4578Q0 12.0478 0 12.8821Q0 13.7164 0.59 14.3064Q1.1799 14.8963 2.0142 14.8963Q2.8485 14.8963 3.4385 14.3064L8.8444 8.9005L7.9958 8.052L2.59 13.4578Q2.3515 13.6963 2.0142 13.6963Q1.677 13.6963 1.4385 13.4578Q1.2 13.2193 1.2 12.8821Q1.2 12.5448 1.4385 12.3064L7.6601 6.0847Q8.8609 6.7696 9.9038 7.6204Q12.3371 9.6056 13.2462 12.0051Q13.3286 12.2429 13.5609 12.3395Q13.7872 12.4495 14.0199 12.3536Q14.194 12.2902 14.2984 12.1372Q14.4068 11.987 14.4072 11.8017Q14.459 8.4358 12.2057 5.3174Q9.969 2.2218 6.2641 0.4907Q5.6636 0.2101 5.415 0.1409Q4.9087 0 4.4826 0.1859Q4.1015 0.3522 3.8452 0.7962Q3.7204 1.0124 3.4651 1.6298L3.4638 1.633L3.4222 1.7337Q3.4095 1.7643 3.3849 1.8238Q3.1054 2.4987 3.0381 2.7676Q2.8998 3.3203 3.1034 3.7425Q3.2831 4.1152 3.7555 4.3571Q3.9811 4.4726 4.6063 4.6987ZM10.6624 6.6906Q8.315 4.7755 5.2372 3.6511Q5.1593 3.6227 5.0145 3.5703Q4.2127 3.2802 4.1843 3.2213Q4.1416 3.1328 4.4936 2.2829Q4.5183 2.2232 4.5311 2.1922L4.5728 2.0915L4.5741 2.0883Q4.8934 1.3159 4.9625 1.2858Q5.0496 1.2478 5.7561 1.5779Q9.1787 3.1771 11.233 6.0201Q12.1806 7.3316 12.6737 8.6809Q11.8234 7.6378 10.6624 6.6906ZM10.0312 10.5647C9.9585 10.3032 9.5796 10.3284 9.4539 10.6029L8.8284 11.9696C8.7889 12.0557 8.7157 12.1262 8.6286 12.163L7.2451 12.7441C6.9676 12.861 6.9301 13.2405 7.1879 13.3222L8.473 13.7281C8.5541 13.7537 8.6138 13.8161 8.6366 13.8983L8.998 15.1995C9.0706 15.461 9.4496 15.4358 9.5753 15.1612L10.2008 13.7945C10.2404 13.7084 10.3135 13.6379 10.4006 13.6012L11.7831 13.0201C12.0609 12.9032 12.0984 12.5235 11.8403 12.442L10.5562 12.0361C10.4752 12.0105 10.4155 11.9488 10.3926 11.8669L10.0312 10.5647Z"></path></svg>',
  menuConnector: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path></svg>',
  summonMore: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 4.5h6.5V11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.5 4.5L4.5 11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  skillUpload: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2 1.60711)" d="M6.6 1.8414L9.5757 4.8171L10.4243 3.9686L7.1314 0.6757L7.1217 0.6661Q6.8076 0.3519 6.6673 0.2453Q6.3444 0 6 0Q5.6556 0 5.3327 0.2453Q5.1924 0.3519 4.8783 0.6661L4.8686 0.6757L1.5757 3.9686L2.4243 4.8171L5.4 1.8414L5.4 9.3929L6.6 9.3929L6.6 1.8414ZM12 12.4929L12 11.2929L0 11.2929L0 12.4929L12 12.4929Z"></path></svg>',
  skillManage: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 0.709401 1.33782)" d="M13.6555 4.3622Q14.1634 5.2418 14.3164 5.5797Q14.5812 6.1642 14.5812 6.6622Q14.5812 7.1602 14.3164 7.7447Q14.1634 8.0826 13.6555 8.9622L12.4649 11.0244Q11.9571 11.904 11.741 12.2055Q11.3672 12.727 10.9359 12.976Q10.5046 13.225 9.866 13.288Q9.4969 13.3244 8.4812 13.3244L6.1 13.3244Q5.0843 13.3244 4.7152 13.288Q4.0766 13.225 3.6453 12.976Q3.214 12.727 2.8402 12.2055Q2.6241 11.904 2.1163 11.0244L0.9257 8.9622Q0.4178 8.0826 0.2648 7.7447Q0 7.1602 0 6.6622Q0 6.1642 0.2648 5.5797Q0.4178 5.2418 0.9257 4.3622L2.1163 2.3Q2.6241 1.4204 2.8402 1.1189Q3.214 0.5973 3.6453 0.3483Q4.0766 0.0993 4.7152 0.0364Q5.0843 0 6.1 0L8.4812 0Q9.4969 0 9.866 0.0364Q10.5046 0.0993 10.9359 0.3483Q11.3672 0.5973 11.741 1.1189Q11.7677 1.1562 11.7989 1.2023L8.8058 1.2023Q8.6509 1.2 8.4812 1.2L6.1 1.2Q4.5702 1.2 4.2453 1.3876Q3.9204 1.5751 3.1555 2.9L1.9649 4.9622Q1.2 6.287 1.2 6.6622Q1.2 7.0373 1.9649 8.3622L3.1555 10.4244Q3.9204 11.7492 4.2453 11.9368Q4.5702 12.1244 6.1 12.1244L8.4812 12.1244Q10.011 12.1244 10.3359 11.9368Q10.6608 11.7492 11.4257 10.4244L12.6163 8.3622Q13.3812 7.0373 13.3812 6.6622Q13.3812 6.287 12.6163 4.9622L11.4257 2.9Q11.2681 2.627 11.1292 2.4023L12.524 2.4023L13.6555 4.3622ZM7.2911 3.6622Q8.5337 3.6622 9.4124 4.5409Q10.2911 5.4195 10.2911 6.6622Q10.2911 7.9048 9.4124 8.7835Q8.5337 9.6622 7.2911 9.6622Q6.0484 9.6622 5.1698 8.7835Q4.2911 7.9048 4.2911 6.6622Q4.2911 5.4195 5.1698 4.5409Q6.0484 3.6622 7.2911 3.6622ZM7.2911 4.8622Q6.5455 4.8622 6.0183 5.3894Q5.4911 5.9166 5.4911 6.6622Q5.4911 7.4078 6.0183 7.935Q6.5455 8.4622 7.2911 8.4622Q8.0367 8.4622 8.5639 7.935Q9.0911 7.4078 9.0911 6.6622Q9.0911 5.9166 8.5639 5.3894Q8.0367 4.8622 7.2911 4.8622Z"></path></svg>',
  connManage: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.57586 2.39996)" d="M9.8242 6.6001L9.8242 5.109Q9.8243 3.305 9.7462 2.7323Q9.7081 2.4537 9.6375 2.2354L0.8485 11.0243L0 10.1758L8.789 1.3868Q8.5706 1.3162 8.292 1.2782Q7.7193 1.2 5.9153 1.2001L4.4243 1.2001L4.4243 0L5.9152 0Q7.8008 -0 8.4543 0.0892Q9.5761 0.2423 10.179 0.8453Q10.782 1.4482 10.9351 2.57Q11.0243 3.2235 11.0243 5.1091L11.0243 6.6001L9.8242 6.6001Z"></path></svg>',
  connLink: '<svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path></svg>',
  pinRest: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><clipPath id="wb-pin-clip-:r4n:"><rect width="16" height="16"></rect></clipPath><g clip-path="url(#wb-pin-clip-:r4n:)"><path fill="currentColor" fill-rule="evenodd" transform="matrix(0.707107 0.707107 -0.707107 0.707107 9.66 -1.44)" d="M8.9091 1.7259C9.0313 2.1014 9.0313 2.5676 9.0313 3.5L9.0313 3.9998C9.0313 4.6592 9.0313 4.9889 9.0829 5.3072C9.1518 5.7316 9.2887 6.1423 9.4883 6.5232C9.638 6.8088 9.8359 7.0725 10.2316 7.6C10.7349 8.271 11.0022 8.6051 11.0295 8.9079C11.0634 9.2833 10.8774 9.6554 10.5568 9.8535C10.3173 10.0015 9.9329 10.001 9.2114 10.0002L9.2087 10.0002L9.208 10.0002C9.1513 10.0001 9.0926 10 9.0317 10L7.3316 10L7.3316 8.8L9.0317 8.8Q9.0949 8.8 9.2128 8.8002Q9.457 8.8005 9.628 8.7982Q9.5272 8.66 9.3804 8.4649Q9.3093 8.3703 9.2717 8.3201Q8.62 7.4515 8.4255 7.0803Q8.0336 6.3326 7.8984 5.4994Q7.8313 5.0857 7.8313 3.9998L7.8313 3.5Q7.8313 2.2917 7.768 2.0971Q7.5633 1.468 6.9341 1.2633Q6.7396 1.2 5.5313 1.2Q4.323 1.2 4.1284 1.2633Q3.4992 1.468 3.2946 2.0971Q3.2313 2.2917 3.2313 3.5L3.2313 4.0002Q3.2313 5.0862 3.1641 5.4999Q3.029 6.3325 2.6376 7.0797Q2.4431 7.451 1.7916 8.3199Q1.754 8.37 1.6829 8.4647Q1.5361 8.6599 1.4352 8.7982Q1.6064 8.8005 1.8507 8.8002Q1.9695 8.8 2.0318 8.8L6.1316 8.8L6.1316 10L6.1313 10L6.1317 17L4.9317 17.0001L4.9313 10L2.0318 10C1.9696 10 1.9098 10.0001 1.8521 10.0002C1.1304 10.001 0.7459 10.0015 0.5064 9.8534C0.1859 9.6553 0 9.2835 0.0338 8.9083C0.061 8.6054 0.3283 8.2712 0.8316 7.6C1.2272 7.0723 1.425 6.8085 1.5746 6.5229C1.774 6.1422 1.9108 5.7319 1.9796 5.3077C2.0313 4.9894 2.0313 4.6597 2.0313 4.0002L2.0313 3.5C2.0313 2.5676 2.0313 2.1014 2.1534 1.7259C2.4 0.9678 2.9991 0.3688 3.7572 0.1222C4.1327 0 4.5989 0 5.5313 0C6.4637 0 6.9299 0 7.3054 0.1222C8.0634 0.3688 8.6625 0.9678 8.9091 1.7259Z"></path></g></svg>',
  pinHover: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.12637 0.941389)" d="M13.6129 5.1387C13.4338 5.4905 13.1041 5.8202 12.4448 6.4795L12.0914 6.8329C11.6251 7.2992 11.392 7.5323 11.2035 7.7939C10.952 8.1427 10.7584 8.5299 10.6303 8.9404C10.6282 8.9471 10.6261 8.9538 10.6241 8.9605L13.7979 12.1344L12.9494 12.9829L0.9494 0.9829L1.7979 0.1344L5.0142 3.3507C5.021 3.3486 5.0279 3.3465 5.0347 3.3444C5.4448 3.2162 5.8317 3.0227 6.1803 2.7715C6.4419 2.5829 6.6751 2.3498 7.1414 1.8834L7.4951 1.5297C8.1544 0.8704 8.484 0.5408 8.8359 0.3617C9.5463 0 10.3935 0 11.104 0.3617C11.4558 0.5408 11.7855 0.8704 12.4448 1.5297C13.1041 2.1891 13.4338 2.5187 13.6129 2.8706C13.9746 3.581 13.9746 4.4282 13.6129 5.1387ZM5.9457 4.2821Q6.4391 4.0641 6.882 3.745Q7.222 3.4999 7.9899 2.732L8.3436 2.3783Q9.198 1.5239 9.3803 1.4311Q9.9699 1.1309 10.5596 1.4311Q10.7419 1.5239 11.5963 2.3783Q12.4507 3.2327 12.5435 3.415Q12.8437 4.0046 12.5435 4.5942Q12.4507 4.7766 11.5963 5.631L11.2429 5.9844Q10.475 6.7522 10.23 7.0922Q9.9106 7.5353 9.6926 8.029L5.9457 4.2821ZM5.7982 9.0253L6.6451 8.1785L2.3466 3.88C2.3144 3.8988 2.2852 3.9192 2.2584 3.9415C1.9692 4.183 1.8377 4.5774 1.9243 4.944C1.9889 5.2182 2.2611 5.4897 2.772 5.9994C2.8129 6.0401 2.8553 6.0824 2.8992 6.1263L4.9495 8.1766L0 13.1267L0.8486 13.9751L5.798 9.0251L5.7982 9.0253ZM7.4936 9.027L10.0951 11.6286C10.0764 11.6606 10.0561 11.6898 10.0338 11.7164C9.7923 12.0059 9.3977 12.1374 9.0309 12.0508C8.7569 11.9861 8.4854 11.714 7.9759 11.2032L7.974 11.2013L7.9734 11.2008C7.9334 11.1607 7.892 11.1191 7.8489 11.076L6.6468 9.8739L7.4936 9.027Z"></path></svg>',
  search: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.25" stroke="currentColor" stroke-width="1.4"></circle><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>'
};
function PickIcon({ name, size = 16 }) {
  const raw = RAW[name];
  if (!raw) return null;
  const html = size === 16 ? raw : raw.replace(/width="16" height="16"/, `width="${size}" height="${size}"`);
  return import_react.default.createElement("span", {
    className: "wbh-pickIcon",
    style: { display: "inline-flex", width: size, height: size },
    "aria-hidden": true,
    dangerouslySetInnerHTML: { __html: html }
  });
}

// src/MarketPage.jsx
var import_react7 = __toESM(require("react"), 1);

// src/hub.js
var API = "/workbuddy-hub";
var _marketNavigator = null;
var _marketListeners = /* @__PURE__ */ new Set();
function setMarketNavigator(fn) {
  _marketNavigator = fn;
}
var _sessionOpener = null;
function setSessionOpener(fn) {
  _sessionOpener = fn;
}
function openSessionById(sessionId) {
  try {
    return Boolean(_sessionOpener?.(sessionId));
  } catch {
    return false;
  }
}
var _presetSelector = null;
function setPresetSelector(fn) {
  _presetSelector = fn;
}
var _sessionStarter = null;
function setSessionStarter(fn) {
  _sessionStarter = fn;
}
function startNewSession() {
  try {
    return Boolean(_sessionStarter?.());
  } catch {
    return false;
  }
}
var RECENT_EXPERTS_KEY = "wbh-recent-experts";
var RECENT_EXPERTS_MAX = 8;
function recentExpertNames() {
  try {
    const raw = localStorage.getItem(RECENT_EXPERTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string" && x) : [];
  } catch {
    return [];
  }
}
function markExpertRecent(entry) {
  const name = entry?.name;
  if (typeof name !== "string" || !name) return;
  try {
    const list = recentExpertNames().filter((n) => n !== name);
    list.unshift(name);
    localStorage.setItem(RECENT_EXPERTS_KEY, JSON.stringify(list.slice(0, RECENT_EXPERTS_MAX)));
  } catch {
  }
}
var _pendingExpert = null;
var PENDING_TTL_MS = 5 * 60 * 1e3;
function setPendingExpert(entry) {
  _pendingExpert = entry ? { ...entry, at: Date.now() } : null;
  console.info("[wbh] pending expert set:", entry?.name);
}
function clearPendingExpert() {
  _pendingExpert = null;
}
function peekPendingExpert() {
  const p = _pendingExpert;
  if (!p) return null;
  if (Date.now() - (p.at || 0) > PENDING_TTL_MS) return null;
  return p;
}
var _composerSession = "";
function setComposerSession(id) {
  _composerSession = id || "";
}
function composerSession() {
  return _composerSession;
}
function onMarketRequest(fn) {
  _marketListeners.add(fn);
  return () => {
    _marketListeners.delete(fn);
  };
}
var _pendingMarket = null;
function consumePendingMarket() {
  const r = _pendingMarket;
  _pendingMarket = null;
  return r;
}
function openMarket(request) {
  _pendingMarket = request;
  try {
    _marketNavigator?.();
  } catch {
  }
  const emit = () => {
    for (const fn of _marketListeners) {
      try {
        fn(request);
      } catch {
      }
    }
  };
  emit();
  try {
    setTimeout(emit, 0);
  } catch {
  }
}
var _selectedBySession = /* @__PURE__ */ new Map();
var _selListeners = /* @__PURE__ */ new Set();
function selectedItems(sessionId) {
  const key = sessionId || "_unbound";
  return _selectedBySession.get(key) || [];
}
function onSelectionChange(fn) {
  _selListeners.add(fn);
  return () => {
    _selListeners.delete(fn);
  };
}
var _emitSelection = () => {
  for (const fn of _selListeners) {
    try {
      fn();
    } catch {
    }
  }
};
function addSelection(entry, sessionId) {
  const key = sessionId || "_unbound";
  const list = _selectedBySession.get(key) || [];
  const itemKey = `${entry.kind}/${entry.name}`;
  if (list.some((x) => x.key === itemKey)) return [];
  const replaced = entry.kind === "expert" ? list.filter((x) => x.kind === "expert") : [];
  const kept = replaced.length ? list.filter((x) => x.kind !== "expert") : list;
  _selectedBySession.set(key, [...kept, { key: itemKey, kind: entry.kind, name: entry.name, displayName: entry.displayName || entry.name, icon: entry.icon || "" }]);
  _emitSelection();
  return replaced;
}
function removeSelection(sessionId, kind, name) {
  const key = sessionId || "_unbound";
  const list = _selectedBySession.get(key) || [];
  const before = list.length;
  const next = list.filter((x) => !(x.kind === kind && x.name === name));
  _pendingMounts.get(key)?.delete(`${kind}/${name}`);
  if (next.length !== before) {
    _selectedBySession.set(key, next);
    _emitSelection();
  }
}
var _pendingMounts = /* @__PURE__ */ new Map();
function markMountPending(sessionId, key) {
  if (!key) return;
  const bucket = sessionId || "_unbound";
  const set = _pendingMounts.get(bucket) || /* @__PURE__ */ new Set();
  set.add(String(key));
  _pendingMounts.set(bucket, set);
}
function clearMountPending(sessionId, key) {
  const bucket = sessionId || "_unbound";
  const set = _pendingMounts.get(bucket);
  if (!set) return;
  set.delete(String(key));
  if (set.size === 0) _pendingMounts.delete(bucket);
}
var _reconcileEpoch = /* @__PURE__ */ new Map();
var _reconcileApplied = /* @__PURE__ */ new Map();
function beginReconcile(sessionId) {
  const bucket = sessionId || "_unbound";
  const next = (_reconcileEpoch.get(bucket) || 0) + 1;
  _reconcileEpoch.set(bucket, next);
  return next;
}
function isCurrentReconcile(sessionId, token) {
  const bucket = sessionId || "_unbound";
  const latest = _reconcileEpoch.get(bucket) || 0;
  if (latest === 0) return true;
  if (!Number.isFinite(token) || token < latest) return false;
  _reconcileApplied.set(bucket, Math.max(_reconcileApplied.get(bucket) || 0, token));
  return true;
}
function reconcileSelections(sessionId, mountedKeys, installed = {}) {
  const key = sessionId || "_unbound";
  const prev = _selectedBySession.get(key) || [];
  const pending = _pendingMounts.get(key);
  const next = [];
  for (const entryKey of mountedKeys || []) {
    const raw = String(entryKey || "");
    const cut = raw.indexOf("/");
    if (cut <= 0) continue;
    const kind = raw.slice(0, cut);
    const name = raw.slice(cut + 1);
    if (!kind || !name || next.some((x) => x.key === raw)) continue;
    const rec = installed[raw] || {};
    next.push({
      key: raw,
      kind,
      name,
      displayName: rec.displayName || rec.name || name,
      icon: rec.icon || ""
    });
  }
  if (pending && pending.size > 0) {
    const pendingExpert = prev.find((x) => pending.has(x.key) && x.kind === "expert");
    if (pendingExpert) {
      for (let i = next.length - 1; i >= 0; i -= 1) if (next[i].kind === "expert") next.splice(i, 1);
    }
    for (const item of prev) {
      if (!pending.has(item.key) || next.some((x) => x.key === item.key)) continue;
      next.push(item);
    }
  }
  const same = prev.length === next.length && prev.every((item, i) => item.key === next[i].key);
  if (same) return prev;
  if (next.length === 0) _selectedBySession.delete(key);
  else _selectedBySession.set(key, next);
  _emitSelection();
  return next;
}
var _changeListeners = /* @__PURE__ */ new Set();
var onCatalogChange = (fn) => {
  _changeListeners.add(fn);
  return () => {
    _changeListeners.delete(fn);
  };
};
var _emitChange = () => {
  for (const fn of _changeListeners) {
    try {
      fn();
    } catch {
    }
  }
};
var _authCache = null;
var _authListeners = /* @__PURE__ */ new Set();
function authState() {
  return _authCache;
}
function authStale(auth = _authCache) {
  return auth?.configured === true && auth?.stale === true;
}
var STALE_LOGIN_REASON = "\u767B\u5F55\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u626B\u7801";
function onAuthChange(fn) {
  _authListeners.add(fn);
  return () => {
    _authListeners.delete(fn);
  };
}
var _emitAuth = () => {
  for (const fn of _authListeners) {
    try {
      fn(_authCache);
    } catch {
    }
  }
};
var _authInflight = null;
async function refreshAuth() {
  if (_authInflight) return _authInflight;
  _authInflight = (async () => {
    try {
      _authCache = await hub.auth();
    } catch {
      _authCache = { configured: false };
    }
    _emitAuth();
    return _authCache;
  })();
  try {
    return await _authInflight;
  } finally {
    _authInflight = null;
  }
}
var _authGate = null;
var _authRequiredListeners = /* @__PURE__ */ new Set();
function onAuthRequired(fn) {
  _authRequiredListeners.add(fn);
  return () => {
    _authRequiredListeners.delete(fn);
  };
}
function claimAuthGate(surface) {
  const gate = _authGate;
  if (!gate || gate.claimed) return null;
  if (surface && gate.surface && surface !== gate.surface) return null;
  gate.claimed = true;
  return { reason: gate.reason, surface: gate.surface };
}
function settleAuthGate(ok) {
  const gate = _authGate;
  if (!gate) return false;
  _authGate = null;
  if (ok) gate.resolve(_authCache ?? { configured: true });
  else gate.reject(new Error("\u7528\u6237\u53D6\u6D88\u4E86\u767B\u5F55"));
  return true;
}
function requireAuth({ reason = "", surface = "" } = {}) {
  const stale = authStale();
  if (_authCache?.configured === true && !stale) return Promise.resolve(_authCache);
  const why = reason || (stale ? STALE_LOGIN_REASON : "");
  if (_authGate) {
    const staleGate = _authGate;
    _authGate = null;
    staleGate.reject(new Error("\u767B\u5F55\u8BF7\u6C42\u5DF2\u88AB\u65B0\u7684\u64CD\u4F5C\u53D6\u4EE3"));
  }
  return new Promise((resolve, reject) => {
    _authGate = { reason: why, surface, at: Date.now(), claimed: false, resolve, reject };
    for (const fn of _authRequiredListeners) {
      try {
        fn({ reason: why, surface });
      } catch {
      }
    }
    if (!_authGate?.claimed) {
      _authGate = null;
      reject(new Error("\u5F53\u524D\u754C\u9762\u65E0\u6CD5\u663E\u793A\u767B\u5F55\u5165\u53E3\uFF08\u8BF7\u6253\u5F00\u5E02\u573A\u9875\u6216\u8F93\u5165\u6846\u300C\uFF0B\u300D\u540E\u518D\u8BD5\uFF09"));
    }
  });
}
var API_TIMEOUT_MS = 3e4;
async function api(path, options) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), API_TIMEOUT_MS) : null;
  let response;
  try {
    response = await fetch(API + path, { ...options, signal: controller?.signal });
  } catch (error) {
    if (controller?.signal?.aborted) throw new Error("\u8BF7\u6C42\u8D85\u65F6\uFF0830s\uFF09");
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || `HTTP ${response.status}`);
    error.body = body;
    error.status = response.status;
    throw error;
  }
  return body;
}
var post = (path, payload) => api(path, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload)
});
var idleList = () => api("/idle");
var idleShown = () => post("/idle/shown", {});
var idleDismissGlobal = () => post("/idle/dismiss-global", {});
var idleClose = (items) => post("/idle/close", { items });
var REGISTRY = "https://acc-1258344699.cos.accelerate.myqcloud.com/workbuddy/expert-marketplace";
function toEntry(row, kind) {
  const name = row.agent_name ?? row.name ?? row.id ?? row.skill_id ?? "";
  let icon = row.icon || row.avatar || "";
  if (icon.startsWith("/")) icon = REGISTRY + icon;
  return {
    kind,
    name,
    displayName: row.display_name_zh || row.display_name_en || row.displayName || name,
    subtitle: row.profession_zh || row.profession_en || row.subtitle || "",
    description: row.description_zh || row.description_en || row.description || "",
    icon,
    tags: (row.tags ?? []).map((t) => typeof t === "string" ? t : t.zh || t.en).filter(Boolean).slice(0, 4),
    quickPrompts: (row.quickPrompts ?? []).map((q) => typeof q === "string" ? q : q.zh || q.en).filter(Boolean),
    useCount: row.use_count || row.useCount || row.usage || "",
    updatedAt: row.updated_at || row.updatedAt || row.created_at || "",
    official: true
  };
}
var hub = {
  api,
  post,
  toEntry,
  /** Catalogue for one kind, official sources first. */
  async list(kind, { query = "", category = "", page = 1, pageSize = 60 } = {}) {
    const q = encodeURIComponent(query);
    const c = encodeURIComponent(category || "");
    if (kind === "connector") {
      const r = await api(`/market-list?kind=connector&pageSize=${pageSize}&q=${q}`);
      const rows = (r.rows ?? []).map((x) => {
        const src = x.source ?? r.source ?? "official";
        return {
          ...toEntry(x, "connector"),
          source: src,
          official: src === "official",
          isConnected: x.isConnected,
          mcp: x.mcp,
          authType: x.authType,
          desktop: x.desktop || null
        };
      });
      if (rows.length === 0 && r.error) throw new Error(String(r.error));
      return {
        rows,
        total: r.total ?? rows.length,
        hasMore: false,
        source: r.source,
        officialTotal: r.officialTotal ?? null,
        desktopTotal: r.desktopTotal ?? null,
        // 与官方是同一连接器而被隐藏的桌面条目数（同 id 或同「展示名+描述」）
        desktopDuplicates: r.desktopDuplicates ?? 0,
        desktop: r.desktop || null
      };
    }
    if (kind === "expert") {
      try {
        const e = await api(`/official-experts?limit=500&q=${q}&category=${c}`);
        const rows = (e.rows ?? []).map((x) => toEntry(x, kind));
        if (rows.length) {
          const start = (page - 1) * pageSize;
          return {
            rows: rows.slice(start, start + pageSize),
            total: e.total ?? rows.length,
            hasMore: start + pageSize < (e.total ?? rows.length),
            source: "official-registry"
          };
        }
        if (String(query).trim() !== "") {
          return { rows: [], total: 0, hasMore: false, source: "official-registry" };
        }
      } catch {
      }
    }
    let listError = "";
    try {
      const r = await api(`/market-list?kind=${kind}&page=${page}&pageSize=${pageSize}&q=${q}&category=${c}`);
      if (r.source === "official") {
        const rows = (r.rows ?? []).map((x) => toEntry(x, kind));
        const total = r.total ?? rows.length;
        if (rows.length === 0 && r.error) throw new Error(String(r.error));
        return { rows, total, hasMore: page * pageSize < total, source: "official" };
      }
    } catch (error) {
      listError = String(error?.message || error);
    }
    try {
      await api("/catalog");
      const m = await api(`/search?q=${q}&kind=${kind}s&limit=${pageSize}`);
      const rows = (m.hits ?? []).map((x) => ({ ...toEntry(x, kind), official: false }));
      return { rows, total: m.total ?? rows.length, hasMore: false, source: "mirror" };
    } catch (error) {
      throw new Error(listError || String(error?.message || error) || "\u5B98\u65B9\u76EE\u5F55\u4E0D\u53EF\u7528");
    }
  },
  /** Category chips for one kind (官方来源). */
  async categories(kind) {
    try {
      if (kind === "expert") {
        const r2 = await api("/official-expert-categories");
        return (r2.items ?? []).map((c) => ({ id: c.id, label: c.label || c.name, count: c.count }));
      }
      const r = await api(`/market-categories?kind=${kind}`);
      return (r.items ?? []).map((c) => ({ id: c.id, label: c.label || c.name, count: c.count }));
    } catch {
      return [];
    }
  },
  installed: () => api("/installed").then((r) => r.installed || {}),
  /** 桌面端公开静态目录状态（条目数 / etag / 抓取时间 / 是否 stale）。 */
  desktopCatalog: () => api("/desktop-catalog"),
  refreshDesktopCatalog: (force) => post("/desktop-catalog/refresh", { force: force === true }),
  /**
   * 检查更新（只读路由；宿主侧对结果有 60s 短缓存）。
   * @param {{refresh?: boolean}} [opts] refresh=true → `?refresh=1` 强制重算
   *   （安装/更新成功后用它拿到最新判定；普通点「检查更新」走缓存，便宜）。
   */
  updates: (opts = {}) => api(`/updates${opts?.refresh ? "?refresh=1" : ""}`),
  localSkills: () => api("/local-skills").then((r) => r.rows || []).catch(() => []),
  mounted: (sessionId) => sessionId ? api(`/mounted?sessionId=${encodeURIComponent(sessionId)}`).then((r) => r.keys || []) : Promise.resolve([]),
  install: (kind, name, source) => post("/install", { kind, name, source }).then((r) => {
    _emitChange();
    return r;
  }),
  uninstall: (kind, name) => post("/uninstall", { kind, name }).then((r) => {
    _emitChange();
    return r;
  }),
  mount: (sessionId, kind, name) => post("/mount", { sessionId, kind, name }).then((r) => {
    _emitChange();
    return r;
  }),
  unmount: (sessionId, kind, name) => post("/unmount", { sessionId, kind, name }).then((r) => {
    _emitChange();
    return r;
  }),
  summon: (name, task, sessionId) => post("/summon", { name, task, sessionId }).then((r) => {
    _emitChange();
    return r;
  }),
  // 方案 B：把专家做成真正的 agent preset，并在新会话里选中它（真接管）。
  expertPresetEnsure: (name) => post("/expert-preset-ensure", { name }),
  activeSession: () => api("/active-session").catch(() => ({ sessionId: "" })),
  boundConnectors: () => api("/connectors/bound").then((r) => r.items || []).catch(() => []),
  connectorAuthStart: (name) => post("/connectors/auth-start", { name }),
  connectorUnbind: (name) => post("/connectors/unbind", { name }),
  connectorInstall: (name, source) => post("/connectors/install", { name, source }),
  connectorNativeRow: (name) => api(`/connectors/native-row?name=${encodeURIComponent(name)}`),
  connectorTools: (name) => api(`/connectors/tools?name=${encodeURIComponent(name)}`),
  connectorOauthStatus: (name) => api(`/connectors/oauth-status?name=${encodeURIComponent(name)}`),
  // MCP 标准 OAuth（QQ邮箱这类端点自述需要授权的连接器）：拉起授权页 → 轮询 → 自动连接
  mcpOauthStart: (name) => post("/connectors/mcp-oauth/start", { name }),
  mcpOauthStatus: (name) => api(`/connectors/mcp-oauth/status?name=${encodeURIComponent(name)}`),
  mcpOauthRefresh: (name) => post("/connectors/mcp-oauth/refresh", { name }),
  // 跨机/弹窗被拦时的兜底：把浏览器地址栏的回调链接整段粘回来完成授权
  mcpOauthComplete: (name, url) => post("/connectors/mcp-oauth/complete", { name, url }),
  mcpOauthCancel: (name) => post("/connectors/mcp-oauth/cancel", { name }),
  enableConnector: (name) => post("/connectors/enable", { name }).then((r) => {
    _emitChange();
    return r;
  }),
  disableConnector: (name) => post("/connectors/disable", { name }).then((r) => {
    _emitChange();
    return r;
  }),
  // 本地 MCP 服务器（用户手工注册的 loopback 服务）。token 只在 POST 请求体里
  // 出现一次（交给宿主写凭据库），前端 state 不留存、不回显。
  localMcpList: () => api("/mcp/local").catch((error) => ({
    ok: false,
    guarded: false,
    servers: [],
    error: String(error?.message || error)
  })),
  localMcpSave: (name, url, token, opts = {}) => post("/mcp/local", {
    name,
    url,
    // 空 token 不发送（语义 = 沿用已存凭据；宿主只对非空 token 才写凭据库）
    ...token ? { token } : {},
    ...opts.tokenRef ? { tokenRef: opts.tokenRef } : {},
    ...opts.note ? { note: opts.note } : {}
  }),
  localMcpEnable: (name) => post("/mcp/local/enable", { name }),
  localMcpDisable: (name) => post("/mcp/local/disable", { name }),
  localMcpRemove: (name) => post("/mcp/local/remove", { name }).then((r) => {
    _emitChange();
    return r;
  }),
  // 宿主侧 MCP 总清单：本插件托管的本地 MCP + 官方连接器建立的 MCP 行 + **DSH 自己
  // 加载的**（其它插件 / 配置行，如 openviking 的 mcp-proxy）。picker 的「本机 MCP」用它。
  hostMcpList: () => api("/mcp/host").catch((error) => ({
    ok: false,
    guarded: false,
    servers: [],
    error: String(error?.message || error)
  })),
  auth: () => api("/wb-auth"),
  authStart: () => post("/wb-auth/start", {}),
  authPoll: () => post("/wb-auth/poll", {}),
  authLogout: () => post("/wb-auth/logout", {})
};
async function summonExpertInNewSession(entry) {
  try {
    const key = `expert/${entry.name}`;
    let already = false;
    try {
      already = Boolean((await hub.installed())[key]);
    } catch {
    }
    if (!already) {
      try {
        await hub.install("expert", entry.name, entry.official ? "official" : void 0);
      } catch (error) {
        const fresh = await hub.installed().catch(() => ({}));
        if (!fresh[key]) return { ok: false, error: `\u5B89\u88C5\u4E13\u5BB6\u5931\u8D25\uFF1A${String(error?.message || error)}` };
      }
    }
    const replaced = peekPendingExpert()?.name || "";
    setPendingExpert(entry);
    markExpertRecent(entry);
    const started = startNewSession();
    if (!started) {
      clearPendingExpert();
      return { ok: false, error: "\u65E0\u6CD5\u8FDB\u5165\u65B0\u5EFA\u4F1A\u8BDD\u6D41\u7A0B\uFF08uiWorkspace \u4E0D\u53EF\u7528\uFF09" };
    }
    return { ok: true, pending: true, replaced };
  } catch (error) {
    clearPendingExpert();
    return { ok: false, error: String(error?.message || error) };
  }
}

// src/insert-prompt.js
function insertPromptIntoComposer(text) {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor || !text) return false;
  editor.focus();
  const sel = window.getSelection();
  sel.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  sel.addRange(range);
  let ok = false;
  try {
    ok = document.execCommand("insertText", false, text);
  } catch {
    ok = false;
  }
  if (!ok) {
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    editor.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
  }
  return true;
}

// src/icons.js
var import_react2 = __toESM(require("react"), 1);
var h = import_react2.default.createElement;
var WB_ICONS = {
  plus: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.5 1.49597)" d="M7.165 7.165L7.165 13L5.835 13L5.835 7.165L0 7.165L0 5.835L5.835 5.835L5.835 0L7.165 0L7.165 5.835L13 5.835L13 7.165L7.165 7.165Z"></path>'],
  person: ["0 0 12 12", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" stroke="currentColor" stroke-width="1"></path><path d="M6 3V9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path><path d="M3 6H9" stroke="currentColor" stroke-width="1" stroke-linecap="round"></path>'],
  sparkle: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" d="M6.1838 2.2198C6.6022 1.3093 7.8641 1.2266 8.1057 2.0938L8.84 4.7335C8.992 5.2783 9.3896 5.6893 9.929 5.8595L12.5432 6.6827C13.4014 6.9536 13.2757 8.2113 12.3517 8.5987L9.9973 9.5861L9.8362 9.6583C9.0366 10.0399 8.3731 10.7089 8.0031 11.5138L6.9377 13.8341L6.8488 13.9943C6.3971 14.7003 5.39 14.7669 5.0735 14.1115L5.0158 13.9601L4.2815 11.3205C4.1485 10.8435 3.8277 10.4679 3.3879 10.2677L3.1916 10.1935L0.5783 9.3712C-0.2801 9.1005 -0.155 7.8418 0.7687 7.4542L3.1242 6.4679C3.9412 6.1253 4.632 5.4846 5.0403 4.6983L5.1183 4.5392L6.1838 2.2198ZM6.2004 4.88C5.652 6.0736 4.6394 7.0538 3.4279 7.5616L1.5295 8.3565L3.719 9.046C4.5745 9.3157 5.2059 9.9689 5.4465 10.8331L6.0608 13.0431L6.9201 11.174C7.4685 9.9802 8.4821 9.0001 9.6935 8.4923L11.591 7.6964L9.4025 7.0069C8.547 6.7373 7.9156 6.085 7.675 5.2208L7.0598 3.0099L6.2004 4.88ZM12.7072 0.214C12.8295 -0.052 13.198 -0.0764 13.2687 0.1768L13.6194 1.4395C13.6415 1.5192 13.7005 1.5797 13.7795 1.6046L15.0285 1.9981C15.2795 2.0772 15.243 2.4445 14.9728 2.5577L13.6281 3.1212C13.5431 3.1568 13.4722 3.226 13.4338 3.3097L12.8254 4.6349C12.703 4.9009 12.3344 4.9245 12.2639 4.671L11.9124 3.4093C11.8901 3.3296 11.8319 3.2691 11.7531 3.2442L10.5031 2.8507C10.2522 2.7715 10.2888 2.4045 10.5588 2.2911L11.9035 1.7267C11.9884 1.6911 12.0593 1.6228 12.0978 1.5392L12.7072 0.214Z"></path>'],
  link: ["0 0 16 16", 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 0.435199 0.715962)" d="M7.5656 4.2827C8.2868 4.6991 8.7999 5.2128 9.1214 5.8068C9.4424 6.4 9.5528 7.0359 9.5284 7.6644C9.5192 7.8997 9.4911 8.1358 9.4474 8.3709L8.3226 7.7215C8.325 7.6869 8.3279 7.6525 8.3293 7.6183C8.3469 7.1636 8.2661 6.7484 8.0655 6.3778C7.8653 6.0082 7.5257 5.6444 6.966 5.3213C6.4063 4.9981 5.9214 4.8859 5.5013 4.8973C5.08 4.9089 4.68 5.0465 4.2951 5.2892C3.5056 5.787 2.8232 6.6961 2.254 7.6819C1.6848 8.6678 1.2387 9.7133 1.2024 10.6459C1.1847 11.1006 1.2655 11.5158 1.4661 11.8864C1.6663 12.256 2.0059 12.6198 2.5656 12.9429C3.1254 13.2661 3.6102 13.3783 4.0304 13.3669C4.4516 13.3553 4.8516 13.2177 5.2365 12.975C5.7924 12.6245 6.2937 12.0689 6.7412 11.4273L7.784 12.0294C7.2672 12.7855 6.6365 13.511 5.876 13.9904C5.3439 14.3258 4.738 14.5482 4.0638 14.5668C3.3886 14.5853 2.6872 14.3978 1.966 13.9815C1.2448 13.5651 0.7317 13.0514 0.4102 12.4574C0.0892 11.8642 -0.0211 11.2283 0.0033 10.5998C0.0512 9.3663 0.6211 8.1118 1.2154 7.0823C1.8098 6.0528 2.6114 4.932 3.6556 4.2738C4.1877 3.9384 4.7936 3.716 5.4678 3.6974C6.143 3.6789 6.8445 3.8663 7.5656 4.2827ZM13.1637 0.5865C13.8848 1.0029 14.3979 1.5167 14.7195 2.1106C15.0405 2.7038 15.1508 3.3397 15.1264 3.9683C15.0785 5.2017 14.5086 6.4563 13.9142 7.4858C13.3199 8.5153 12.5183 9.636 11.4741 10.2943C10.942 10.6296 10.3361 10.8521 9.6618 10.8706C8.9867 10.8892 8.2852 10.7017 7.5641 10.2853C6.8429 9.869 6.3298 9.3552 6.0083 8.7613C5.6873 8.1681 5.5769 7.5322 5.6013 6.9037C5.6105 6.6684 5.6386 6.4323 5.6823 6.1971L6.8071 6.8465C6.8046 6.8811 6.8018 6.9155 6.8004 6.9498C6.7828 7.4045 6.8636 7.8197 7.0642 8.1903C7.2643 8.5599 7.6039 8.9236 8.1637 9.2468C8.7234 9.5699 9.2083 9.6822 9.6284 9.6707C10.0497 9.6591 10.4496 9.5215 10.8346 9.2789C11.6241 8.7811 12.3065 7.872 12.8757 6.8862C13.4449 5.9003 13.8909 4.8548 13.9273 3.9221C13.945 3.4674 13.8642 3.0523 13.6636 2.6816C13.4634 2.3121 13.1238 1.9483 12.5641 1.6251C12.0043 1.3019 11.5195 1.1897 11.0993 1.2012C10.6781 1.2128 10.2781 1.3504 9.8932 1.593C9.3373 1.9435 8.836 2.4991 8.3884 3.1407L7.3456 2.5387C7.8624 1.7825 8.4932 1.057 9.2537 0.5776C9.7858 0.2422 10.3917 0.0198 11.0659 0.0013C11.7411 -0.0173 12.4425 0.1702 13.1637 0.5865Z"></path>'],
  search: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
  more: ["0 0 16 16", 'xmlns="http://www.w3.org/2000/svg"', '<path fill="currentColor" transform="matrix(1 0 0 1 2 7)" d="M0 1C0 0.4477 0.4477 0 1 0C1.5523 0 2 0.4477 2 1C2 1.5523 1.5523 2 1 2C0.4477 2 0 1.5523 0 1ZM5 1C5 0.4477 5.4477 0 6 0C6.5523 0 7 0.4477 7 1C7 1.5523 6.5523 2 6 2C5.4477 2 5 1.5523 5 1ZM10 1C10 0.4477 10.4477 0 11 0C11.5523 0 12 0.4477 12 1C12 1.5523 11.5523 2 11 2C10.4477 2 10 1.5523 10 1Z"></path>'],
  trash: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M2.5 4H13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path><path d="M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.5 4V13C3.5 13.5523 3.94772 14 4.5 14H11.5C12.0523 14 12.5 13.5523 12.5 13V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.5 7V11M9.5 7V11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"></path>'],
  refresh: ["0 0 24 24", 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>'],
  check: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
  close: ["0 0 16 16", 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.56512 2.56512)" d="M6.3046 5.4349L10.8698 10L10 10.8698L5.4349 6.3046L0.8698 10.8698L0 10L4.5651 5.4349L0 0.8698L0.8698 0L5.4349 4.5651L10 0L10.8698 0.8698L6.3046 5.4349Z"></path>'],
  external: ["0 0 24 24", 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"', '<path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><path d="m21 3-9 9"></path><path d="M15 3h6v6"></path>'],
  download: ["0 0 16 16", 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M8 11.3333V2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 7.33301L8 11.333L12 7.33301" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6666 14H3.33325" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
  gear: ["0 0 24 24", 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'],
  grid: ["0 0 12 13", 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<g clip-path="url(#clip0_30165_28096)"><path d="M6.00011 1.25003L6.00011 11.7501" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></path><rect x="7.875" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect><rect x="0.75" y="5" width="3.375" height="3" stroke="currentColor" stroke-width="0.975" stroke-linecap="round" stroke-linejoin="round"></rect></g><defs ><clipPath id="clip0_30165_28096"><rect width="12" height="12" fill="currentColor" transform="translate(0 0.5)"></rect></clipPath></defs>'],
  bell: ["0 0 12 12", 'xmlns="http://www.w3.org/2000/svg" fill="none"', '<path d="M7.5 1H4.5C4.22386 1 4 1.22386 4 1.5V2.5C4 2.77614 4.22386 3 4.5 3H7.5C7.77614 3 8 2.77614 8 2.5V1.5C8 1.22386 7.77614 1 7.5 1Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 2H9C9.26522 2 9.51957 2.10536 9.70711 2.29289C9.89464 2.48043 10 2.73478 10 3V10C10 10.2652 9.89464 10.5196 9.70711 10.7071C9.51957 10.8946 9.26522 11 9 11H3C2.73478 11 2.48043 10.8946 2.29289 10.7071C2.10536 10.5196 2 10.2652 2 10V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 5.5H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 8H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 5.5H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 8H4.005" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>'],
  chevronRight: ["0 0 14 14", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M5 3.5 9 7l-4 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>'],
  chevronLeft: ["0 0 16 16", 'fill="none" xmlns="http://www.w3.org/2000/svg"', '<path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'],
  chevronDown: ["0 0 14 14", 'xmlns="http://www.w3.org/2000/svg" fill="none" transition="transform 0.2s ease"', '<path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>']
};
function WbIcon({ name, size = 16, className }) {
  const spec = WB_ICONS[name];
  if (spec === void 0) return null;
  return h("svg", {
    viewBox: spec[0],
    width: size,
    height: size,
    className,
    "aria-hidden": true,
    focusable: false,
    dangerouslySetInnerHTML: { __html: spec[2] }
  });
}

// src/Catalogue.jsx
var import_react4 = __toESM(require("react"), 1);

// src/WbAuthCard.jsx
var import_react3 = __toESM(require("react"), 1);
var import_qrcode = __toESM(require_browser(), 1);

// src/auth-flow.js
var LOCAL_QR_TTL_MS = 180 * 1e3;
var POLL_INTERVAL_MS = 2500;
var FIRST_POLL_DELAY_MS = 2e3;
function initialAuthFlow() {
  return { phase: "starting", authUrl: "", qr: "", error: "", nickname: "", deadline: 0 };
}
function qrDeadline(now = Date.now()) {
  return now + LOCAL_QR_TTL_MS;
}
function remainingMs(deadline, now = Date.now()) {
  if (!deadline) return 0;
  return Math.max(0, deadline - now);
}
function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil((ms || 0) / 1e3));
  const mm = Math.floor(total / 60);
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
function reduceAuthFlow(state, event) {
  const base = state || initialAuthFlow();
  switch (event?.type) {
    case "start":
      return { ...base, phase: "starting", error: "", nickname: "", deadline: 0 };
    case "started":
      return {
        ...base,
        phase: "waiting",
        authUrl: event.authUrl || "",
        qr: event.qr || "",
        error: "",
        deadline: event.deadline || 0
      };
    case "startFailed":
      return { ...base, phase: "error", error: String(event.error || "\u53D1\u8D77\u6388\u6743\u5931\u8D25"), deadline: 0 };
    case "tick":
      if (base.phase !== "waiting") return base;
      return event.remaining > 0 ? base : { ...base, phase: "expired" };
    case "polled":
      if (base.phase !== "waiting") return base;
      return { ...base, phase: "done", nickname: event.nickname || "", deadline: 0 };
    case "pollFailed":
      if (base.phase !== "waiting") return base;
      return { ...base, phase: "error", error: String(event.error || "\u6388\u6743\u5931\u8D25"), deadline: 0 };
    default:
      return base;
  }
}
function pollEvent(response, error) {
  if (error) {
    if (error.body?.pending === true) return { type: "pending" };
    return { type: "pollFailed", error: String(error.message || error) };
  }
  if (response?.ok) return { type: "polled", nickname: response.nickname || "" };
  if (response?.pending) return { type: "pending" };
  return { type: "pollFailed", error: "\u6388\u6743\u5931\u8D25\uFF1A\u5B98\u65B9\u672A\u8FD4\u56DE\u767B\u5F55\u7ED3\u679C" };
}

// src/WbAuthCard.jsx
function WbAuthCard({ variant = "modal", onClose, onDone, reason = "", title = "\u6DFB\u52A0\u817E\u8BAF\u8D26\u53F7 \xB7 \u56FD\u5185\u7248" }) {
  const inline = variant === "inline";
  const [flow, setFlow] = (0, import_react3.useState)(() => initialAuthFlow());
  const [remaining, setRemaining] = (0, import_react3.useState)(0);
  const timer = (0, import_react3.useRef)(null);
  const ticker = (0, import_react3.useRef)(null);
  const stopped = (0, import_react3.useRef)(false);
  const deadlineRef = (0, import_react3.useRef)(0);
  const onDoneRef = (0, import_react3.useRef)(onDone);
  (0, import_react3.useEffect)(() => {
    onDoneRef.current = onDone;
  }, [onDone]);
  const start = (0, import_react3.useCallback)(async () => {
    stopped.current = false;
    setFlow((prev) => reduceAuthFlow(prev, { type: "start" }));
    setRemaining(0);
    try {
      const res = await hub.post("/wb-auth/start", {});
      if (stopped.current) return;
      const url = res.authUrl || "";
      const qr = url ? await import_qrcode.default.toDataURL(url, { width: 320, margin: 1 }) : "";
      if (stopped.current) return;
      const deadline = qrDeadline();
      deadlineRef.current = deadline;
      setRemaining(remainingMs(deadline));
      setFlow((prev) => reduceAuthFlow(prev, { type: "started", authUrl: url, qr, deadline }));
    } catch (error) {
      if (!stopped.current) setFlow((prev) => reduceAuthFlow(prev, { type: "startFailed", error: String(error?.message || error) }));
    }
  }, []);
  (0, import_react3.useEffect)(() => {
    stopped.current = false;
    void start();
    return () => {
      stopped.current = true;
      if (timer.current) clearTimeout(timer.current);
      if (ticker.current) clearInterval(ticker.current);
    };
  }, [start]);
  (0, import_react3.useEffect)(() => {
    if (flow.phase !== "waiting") return void 0;
    setRemaining(remainingMs(deadlineRef.current));
    ticker.current = setInterval(() => {
      const left = remainingMs(deadlineRef.current);
      setRemaining(left);
      setFlow((prev) => reduceAuthFlow(prev, { type: "tick", remaining: left }));
    }, 1e3);
    return () => {
      if (ticker.current) clearInterval(ticker.current);
    };
  }, [flow.phase]);
  (0, import_react3.useEffect)(() => {
    if (flow.phase !== "waiting") return void 0;
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      let response = null;
      let error = null;
      try {
        response = await hub.post("/wb-auth/poll", {});
      } catch (e) {
        error = e;
      }
      if (cancelled) return;
      const event = pollEvent(response, error);
      if (event.type === "pending") {
        timer.current = setTimeout(tick, POLL_INTERVAL_MS);
        return;
      }
      if (event.type === "polled") {
        await refreshAuth();
        if (cancelled) return;
        setFlow((prev) => reduceAuthFlow(prev, event));
        settleAuthGate(true);
        onDoneRef.current?.();
        return;
      }
      setFlow((prev) => reduceAuthFlow(prev, event));
    };
    timer.current = setTimeout(tick, FIRST_POLL_DELAY_MS);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [flow.phase]);
  const copy = (0, import_react3.useCallback)(async () => {
    try {
      await navigator.clipboard.writeText(flow.authUrl);
    } catch {
    }
  }, [flow.authUrl]);
  const body = /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authHead" }, /* @__PURE__ */ import_react3.default.createElement("h3", { className: "wbh-authTitle" }, title), !inline && /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-authClose", onClick: onClose, "aria-label": "\u5173\u95ED" }, "\u2715")), reason ? /* @__PURE__ */ import_react3.default.createElement("p", { className: "wbh-authReason" }, reason) : null, /* @__PURE__ */ import_react3.default.createElement("p", { className: "wbh-authDesc" }, "\u70B9\u5F00\u4E0B\u65B9\u94FE\u63A5\uFF08\u6216\u7528\u5FAE\u4FE1 / QQ \u626B\u7801\uFF09\u5728\u6D4F\u89C8\u5668\u91CC\u5B8C\u6210\u6388\u6743\uFF0C\u9875\u9762\u652F\u6301\u624B\u673A\u53F7\u767B\u5F55\uFF1B\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u7B7E\u5230\u5E76\u7EB3\u7BA1"), flow.phase === "starting" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authWaiting" }, "\u6B63\u5728\u5411\u5B98\u65B9\u53D1\u8D77\u6388\u6743\u2026"), flow.phase === "waiting" && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authQr" }, flow.qr && /* @__PURE__ */ import_react3.default.createElement("img", { src: flow.qr, alt: "\u6388\u6743\u4E8C\u7EF4\u7801", width: 320, height: 320 })), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-authLink", onClick: () => window.open(flow.authUrl, "_blank", "noopener") }, "\u2197 ", flow.authUrl.slice(0, 72), "\u2026"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-authCopy", onClick: copy }, "\u29C9 \u590D\u5236\u94FE\u63A5"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authWaiting" }, "\u25CC \u7B49\u5F85\u626B\u7801\uFF08", formatCountdown(remaining), "\uFF09\xB7 \u6253\u5F00\u94FE\u63A5\u5728\u6D4F\u89C8\u5668\u91CC\u767B\u5F55\uFF0C\u6216\u626B\u7801\uFF1B\u624B\u673A\u53F7\u767B\u5F55\u4E5F\u53EF\u4EE5"), !inline && /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnGhost wbh-authCancel", onClick: onClose }, "\u53D6\u6D88")), flow.phase === "expired" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authDone" }, /* @__PURE__ */ import_react3.default.createElement("p", { className: "wbh-authExpired" }, "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\uFF08\u672C\u5730\u5012\u8BA1\u65F6\u5230\u70B9\uFF1B\u5B98\u65B9\u672A\u4E0B\u53D1\u6709\u6548\u671F\uFF0C\u8FD9\u662F\u4F30\u7B97\uFF09"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: () => void start() }, "\u5237\u65B0\u4E8C\u7EF4\u7801"), flow.authUrl && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-authLink wbh-authLink--block", onClick: () => window.open(flow.authUrl, "_blank", "noopener") }, "\u2197 \u6253\u5F00\u6388\u6743\u94FE\u63A5\uFF08\u53EF\u80FD\u4ECD\u6709\u6548\uFF09"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-authCopy", onClick: copy }, "\u29C9 \u590D\u5236\u94FE\u63A5")), !inline && /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnGhost wbh-authCancel", onClick: onClose }, "\u53D6\u6D88")), flow.phase === "done" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authDone" }, /* @__PURE__ */ import_react3.default.createElement("p", null, "\u5DF2\u767B\u5F55", flow.nickname ? `\uFF1A${flow.nickname}` : "", "\u3002\u5B98\u65B9\u5E02\u573A\u6570\u636E\u5DF2\u53EF\u7528\u3002"), inline ? /* @__PURE__ */ import_react3.default.createElement("p", { className: "wbh-muted" }, "\u6B63\u5728\u52A0\u8F7D\u8FDE\u63A5\u5668\u76EE\u5F55\u2026") : /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: onClose }, "\u5B8C\u6210")), flow.phase === "error" && /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authDone" }, /* @__PURE__ */ import_react3.default.createElement("p", { className: "wbh-authError" }, "\u6388\u6743\u5931\u8D25\uFF1A", flow.error), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: () => void start() }, "\u91CD\u8BD5"), !inline && /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "wbh-btnGhost wbh-authCancel", onClick: onClose }, "\u5173\u95ED")));
  if (inline) return /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authCard wbh-authCard--inline", "aria-label": "\u767B\u5F55 WorkBuddy \u8D26\u53F7" }, body);
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-modalRoot", role: "dialog", "aria-modal": "true", "aria-label": "\u6DFB\u52A0\u817E\u8BAF\u8D26\u53F7" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-modalScrim", onClick: onClose }), /* @__PURE__ */ import_react3.default.createElement("div", { className: "wbh-authCard" }, body));
}

// src/Catalogue.jsx
var CR_ROOT = { expert: "cr-experts-submenu", skill: "cr-skills-submenu", connector: "cr-connectors-submenu" };
var KINDS = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "person" },
  { id: "skill", label: "\u6280\u80FD", icon: "sparkle" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "link" }
];
var SORTS = [
  { id: "reco", label: "\u7EFC\u5408" },
  { id: "hot", label: "\u6700\u70ED" },
  { id: "new", label: "\u6700\u65B0" }
];
var TAB_ICON = { expert: "tabExpert", skill: "tabSkill", connector: "tabConnector" };
var SEARCH_PLACEHOLDER = {
  expert: "\u641C\u7D22\u4E13\u5BB6\u804C\u79F0\u6216\u63CF\u8FF0",
  skill: "\u641C\u7D22\u6280\u80FD",
  connector: "\u641C\u7D22\u8FDE\u63A5\u5668"
};
var FALLBACK_COLORS = 6;
function fallbackIndex(seed = "") {
  let h2 = 0;
  for (const ch of String(seed)) h2 = h2 * 31 + ch.codePointAt(0) >>> 0;
  return h2 % FALLBACK_COLORS + 1;
}
function numeric(value) {
  const n = parseFloat(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function EntryIcon({ entry, size = 44, round = true, radius: radiusOverride, fallbackTint }) {
  const [broken, setBroken] = (0, import_react4.useState)(false);
  const label = entry.displayName || entry.name || "?";
  const radius = radiusOverride ?? (round ? "50%" : `${Math.max(6, Math.round(size * 0.21))}px`);
  if (!entry.icon || broken) {
    const tint = fallbackTint || null;
    return /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "ec-avatar-sq-fallback",
        style: {
          background: tint ? tint.bg : `var(--ec-avatar-fallback-bg-${fallbackIndex(entry.name || label)})`,
          color: tint ? tint.color : void 0,
          fontWeight: tint ? tint.fontWeight : void 0,
          borderRadius: radius,
          fontSize: tint ? tint.fontSize : size <= 16 ? 9 : Math.max(11, Math.round(size * 0.42)),
          width: "100%",
          height: "100%"
        }
      },
      label.slice(0, 1)
    );
  }
  return /* @__PURE__ */ import_react4.default.createElement(
    "img",
    {
      src: entry.icon,
      alt: "",
      loading: "lazy",
      decoding: "async",
      onError: () => setBroken(true),
      style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: radius, flexShrink: 0, background: "rgba(128,128,128,.15)" }
    }
  );
}
var PICKER_TINT = {
  expert: { bg: "rgba(0,0,0,.08)", color: "rgba(0,0,0,.7)", fontSize: 10, fontWeight: 400 },
  connector: { bg: "rgba(0,0,0,.08)", color: "rgba(0,0,0,.7)", fontSize: 10, fontWeight: 400 },
  skill: { bg: "#dbe4ff", color: "#4263eb", fontSize: 9, fontWeight: 600 }
};
function SkillCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`;
  return /* @__PURE__ */ import_react4.default.createElement(
    "div",
    {
      className: "skill-card",
      role: "button",
      tabIndex: 0,
      onClick: () => onDetail?.(entry),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onDetail?.(entry);
        }
      }
    },
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-content" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-icon" }, /* @__PURE__ */ import_react4.default.createElement(EntryIcon, { entry, size: 28, round: false })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-top" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-body" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-name-row" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-card-name" }, entry.displayName)))), /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        className: "skill-add-btn",
        "aria-label": `\u5B89\u88C5 ${entry.displayName}`,
        disabled: busy === key,
        onClick: (e) => {
          e.stopPropagation();
          onAction?.(entry);
        }
      },
      /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "plus", size: 14 })
    )),
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-card-desc skill-card-desc--two-lines" }, entry.description || entry.name)
  );
}
function ExpertCard({ entry, kindLabel, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`;
  const label = busy === key ? "\u2026" : entry.kind === "expert" ? "\u53EC\u5524" : "\u8FDE\u63A5";
  return /* @__PURE__ */ import_react4.default.createElement(
    "article",
    {
      className: `ec-expert-card${entry.kind === "expert" ? " ec-expert-card--selectable" : ""}`,
      role: "button",
      tabIndex: 0,
      onClick: () => onDetail?.(entry),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDetail?.(entry);
        }
      }
    },
    /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        className: "ec-card-summon-btn ec-card-summon-btn--top",
        disabled: busy === key,
        "aria-label": `${label}${entry.displayName}`,
        onClick: (e) => {
          e.stopPropagation();
          onAction?.(entry);
        }
      },
      label
    ),
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-main" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-head" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-avatar-sq" }, /* @__PURE__ */ import_react4.default.createElement(EntryIcon, { entry, size: 44, round: true })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-body" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-title-row" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-role-wrap" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-role" }, entry.displayName))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-subtitle" }, entry.subtitle || kindLabel))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-desc" }, entry.description || entry.name), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-card-tags" }, (entry.tags ?? []).slice(0, 3).map((t) => /* @__PURE__ */ import_react4.default.createElement("span", { key: t, className: "ec-card-tag" }, t))))
  );
}
function ConnectorCard({ entry, busy, onDetail, onAction, onConnectorAction, bound }) {
  const key = `${entry.kind}/${entry.name}`;
  const enabled = bound ? bound.includes(entry.name) : Boolean(entry._enabled || entry.isConnected);
  const dot = busy === key ? "connecting" : enabled ? "connected" : "";
  const unsupported = entry.desktop && entry.desktop.supported === false ? entry.desktop.unsupportedReason || "\u8BE5\u8FDE\u63A5\u5668\u7C7B\u578B\u4E0D\u53D7\u652F\u6301" : "";
  return /* @__PURE__ */ import_react4.default.createElement(
    "div",
    {
      className: `connector-card ${enabled ? "connector-card--installed" : "connector-card--available"}`,
      role: "button",
      tabIndex: 0,
      onClick: () => onDetail?.(entry),
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onDetail?.(entry);
        }
      }
    },
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-icon" }, /* @__PURE__ */ import_react4.default.createElement(EntryIcon, { entry, size: 28, round: true })),
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-main" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-name-row" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-name" }, entry.displayName), entry.source === "desktop" && /* @__PURE__ */ import_react4.default.createElement("span", { className: "connector-card-badge", title: "\u6765\u81EA WorkBuddy \u684C\u9762\u5BA2\u6237\u7AEF\u81EA\u5E26\u7684\u516C\u5F00\u76EE\u5F55" }, "\u684C\u9762\u76EE\u5F55"), unsupported && /* @__PURE__ */ import_react4.default.createElement("span", { className: "connector-card-badge connector-card-badge--warn", title: unsupported }, "\u4E0D\u53EF\u81EA\u52A8\u63A5\u5165"), dot && /* @__PURE__ */ import_react4.default.createElement("span", { className: `connector-card-status-dot connector-card-status-dot--${dot}` })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-desc" }, unsupported || entry.description || entry.name)),
    /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-card-action" }, /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        className: "wb-button wb-button--secondary wb-button--medium",
        disabled: busy === key || Boolean(unsupported),
        "aria-label": `${enabled ? "\u89E3\u7ED1" : "\u8FDE\u63A5"} ${entry.displayName}`,
        title: unsupported || "",
        onClick: (e) => {
          e.stopPropagation();
          void onConnectorAction?.(entry);
        }
      },
      busy === key ? "\u2026" : unsupported ? "\u4E0D\u53EF\u7528" : enabled ? "\u89E3\u7ED1" : "\u8FDE\u63A5"
    ))
  );
}
function Catalogue({
  sessionId,
  kind,
  onKind,
  query,
  onQuery,
  onDetail,
  onAction,
  installed = {},
  mounted = /* @__PURE__ */ new Set(),
  busy = "",
  variant = "page",
  onRefresh,
  footerExtra = null,
  topbarRight = null,
  onSettled = null,
  onMore = null
}) {
  const [rows, setRows] = (0, import_react4.useState)([]);
  const [hasMore, setHasMore] = (0, import_react4.useState)(false);
  const [page, setPage] = (0, import_react4.useState)(1);
  const [loading, setLoading] = (0, import_react4.useState)(true);
  const [loadingMore, setLoadingMore] = (0, import_react4.useState)(false);
  const [failed, setFailed] = (0, import_react4.useState)("");
  const [source, setSource] = (0, import_react4.useState)("");
  const [sourceCounts, setSourceCounts] = (0, import_react4.useState)({ official: null, desktop: null, duplicates: 0, desktopMeta: null });
  const [categories, setCategories] = (0, import_react4.useState)([]);
  const [category, setCategory] = (0, import_react4.useState)("");
  const [sort, setSort] = (0, import_react4.useState)("reco");
  const [featured, setFeatured] = (0, import_react4.useState)([]);
  const [localRows, setLocalRows] = (0, import_react4.useState)([]);
  const [segment, setSegment] = (0, import_react4.useState)(0);
  const [view, setView] = (0, import_react4.useState)("market");
  const [addMenu, setAddMenu] = (0, import_react4.useState)(false);
  const [localOnly, setLocalOnly] = (0, import_react4.useState)(false);
  const [detail, setDetail] = (0, import_react4.useState)(null);
  const [bound, setBound] = (0, import_react4.useState)([]);
  const [hostMcp, setHostMcp] = (0, import_react4.useState)([]);
  const [notice, setNotice] = (0, import_react4.useState)("");
  const [busyLocal, setBusyLocal] = (0, import_react4.useState)("");
  const [pendingAuth, setPendingAuth] = (0, import_react4.useState)(null);
  const [pasteUrl, setPasteUrl] = (0, import_react4.useState)("");
  const [nativeRow, setNativeRow] = (0, import_react4.useState)(null);
  const [toolInfo, setToolInfo] = (0, import_react4.useState)(null);
  const [pinned, setPinned] = (0, import_react4.useState)(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("wbh-pinned") || "[]"));
    } catch {
      return /* @__PURE__ */ new Set();
    }
  });
  const [pinnedEntries, setPinnedEntries] = (0, import_react4.useState)(() => {
    try {
      return JSON.parse(localStorage.getItem("wbh-pinned-entries") || "[]");
    } catch {
      return [];
    }
  });
  const scrollRef = (0, import_react4.useRef)(null);
  const PAGE_SIZE = 60;
  const hubSkills = (0, import_react4.useMemo)(
    () => Object.entries(installed).filter(([, rec]) => rec?.kind === "skill").map(([key, rec]) => ({
      key,
      kind: "skill",
      name: rec.name || key.split("/")[1],
      displayName: rec.displayName || rec.name,
      description: rec.description || "",
      icon: rec.icon || ""
    })),
    [installed]
  );
  (0, import_react4.useEffect)(() => {
    setCategory("");
    setSort("reco");
    setSegment(0);
    setPage(1);
    setView("market");
    setDetail(null);
  }, [kind]);
  (0, import_react4.useEffect)(() => {
    let live = true;
    hub.categories(kind).then((c) => {
      if (live) setCategories(c);
    }).catch(() => {
    });
    if (kind === "skill") hub.localSkills().then((r) => {
      if (live) setLocalRows(r);
    }).catch(() => {
    });
    hub.boundConnectors().then((r) => {
      if (live) setBound(r.map((x) => x.name));
    }).catch(() => {
    });
    return () => {
      live = false;
    };
  }, [kind]);
  const [recentSnapshot, setRecentSnapshot] = (0, import_react4.useState)(() => recentExpertNames());
  (0, import_react4.useEffect)(() => {
    setRecentSnapshot(recentExpertNames());
  }, [kind, query]);
  const refreshHostMcp = (0, import_react4.useCallback)(() => {
    hub.hostMcpList().then((r) => setHostMcp(Array.isArray(r?.servers) ? r.servers : [])).catch(() => setHostMcp([]));
  }, []);
  (0, import_react4.useEffect)(() => {
    if (variant === "picker") refreshHostMcp();
  }, [variant, kind, refreshHostMcp]);
  const localMcpAction = (0, import_react4.useCallback)(async (entry) => {
    const key = `mcp/${entry.name}`;
    setBusyLocal(key);
    setNotice("");
    try {
      const r = entry.enabled ? await hub.localMcpDisable(entry.name) : await hub.localMcpEnable(entry.name);
      if (r && r.ok === false) setNotice(`${entry.enabled ? "\u505C\u7528" : "\u542F\u7528"}\u300C${entry.name}\u300D\u5931\u8D25\uFF1A${r.error || ""}`);
      else setNotice(entry.enabled ? `\u5DF2\u505C\u7528\u672C\u673A MCP\u300C${entry.name}\u300D` : `\u5DF2\u542F\u7528\u672C\u673A MCP\u300C${entry.name}\u300D\uFF0C${Number(r?.toolCount ?? 0) || "\u5176"}\u4E2A\u5DE5\u5177\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528`);
    } catch (error) {
      setNotice(`\u64CD\u4F5C\u5931\u8D25\uFF1A${String(error?.message || error)}`);
    } finally {
      setBusyLocal("");
      refreshHostMcp();
      await onRefresh?.();
    }
  }, [onRefresh, refreshHostMcp]);
  (0, import_react4.useEffect)(() => {
    if (!loading) onSettled?.();
  }, [loading, kind, query, onSettled]);
  const load = (0, import_react4.useCallback)(async (targetPage, replace) => {
    if (replace) {
      setLoading(true);
      setFailed("");
    } else setLoadingMore(true);
    try {
      const r = await hub.list(kind, { query, category, page: targetPage, pageSize: PAGE_SIZE });
      if (replace && kind === "skill") setFeatured([...r.rows].sort(() => Math.random() - 0.5).slice(0, 5));
      if (replace) {
        setSource(r.source || "");
        if (kind === "connector" && !String(query || "").trim()) {
          setSourceCounts({
            official: r.officialTotal ?? null,
            desktop: r.desktopTotal ?? null,
            // 与官方是同一连接器而被隐藏的桌面条目数（宿主如实返回）
            duplicates: r.desktopDuplicates ?? 0,
            desktopMeta: r.desktop ?? null
          });
        }
      }
      setRows((prev) => {
        if (replace) return r.rows;
        const seen = new Set(prev.map((p) => `${p.kind}/${p.name}`));
        return [...prev, ...r.rows.filter((x) => !seen.has(`${x.kind}/${x.name}`))];
      });
      setHasMore(Boolean(r.hasMore));
    } catch (e) {
      if (replace) {
        setFailed(e.message);
        setRows([]);
        setSource("");
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [kind, query, category]);
  (0, import_react4.useEffect)(() => {
    setPage(1);
    void load(1, true);
  }, [load]);
  (0, import_react4.useEffect)(() => {
    const pending = consumePendingMarket();
    if (!pending) return;
    if (pending.kind) onKind?.(pending.kind);
    setView(pending.view || "market");
  }, [onKind]);
  (0, import_react4.useEffect)(() => onMarketRequest((req) => {
    if (req?.kind) onKind?.(req.kind);
    setView(req?.view || "market");
  }), [onKind]);
  (0, import_react4.useEffect)(() => onCatalogChange(() => {
    void load(1, true);
    hub.boundConnectors().then((r) => setBound(r.map((x) => x.name))).catch(() => {
    });
  }), [load]);
  const [auth, setAuth] = (0, import_react4.useState)(() => authState());
  const authRef = (0, import_react4.useRef)(authState());
  (0, import_react4.useEffect)(() => {
    if (authState() === null) void refreshAuth();
    return onAuthChange((next) => {
      const was = authRef.current;
      authRef.current = next;
      setAuth(next);
      if (next?.configured === true && next?.stale !== true && was && (was.configured !== true || was.stale === true)) {
        void load(1, true);
        hub.boundConnectors().then((r) => setBound(r.map((x) => x.name))).catch(() => {
        });
      }
    });
  }, [load]);
  const loggedIn = auth?.configured === true;
  const authStaleNow = loggedIn && auth?.stale === true;
  const isBound = (0, import_react4.useCallback)((entry) => bound.includes(entry.name), [bound]);
  const unmountHere = (0, import_react4.useCallback)((kind2, name) => sessionId ? hub.unmount(sessionId, kind2, name).catch(() => {
  }) : Promise.resolve(), [sessionId]);
  const onScroll = (0, import_react4.useCallback)((e) => {
    const el = e.currentTarget;
    if (!hasMore || loading || loadingMore) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 480) setPage((p) => p + 1);
  }, [hasMore, loading, loadingMore]);
  (0, import_react4.useEffect)(() => {
    if (page > 1) void load(page, false);
  }, [page, load]);
  const visible = (0, import_react4.useMemo)(() => {
    if (kind === "connector") {
      if (bound.length === 0) return rows;
      const rank = (x) => bound.includes(x.name) ? 0 : 1;
      return [...rows].sort((a, b) => rank(a) - rank(b));
    }
    if (kind !== "expert" || sort === "reco") return rows;
    const copy = [...rows];
    if (sort === "hot") copy.sort((a, b) => numeric(b.useCount) - numeric(a.useCount));
    else if (sort === "new") copy.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    return copy;
  }, [rows, sort, kind, bound]);
  const exportNativeRow = (0, import_react4.useCallback)(async (entry) => {
    setBusyLocal(`${entry.kind}/${entry.name}`);
    setNotice("");
    try {
      const r = await hub.connectorNativeRow(entry.name);
      if (r?.ok) {
        setNativeRow(r);
        setNotice(r.conflict ? "\u6CE8\u610F\uFF1A\u8BE5 serverName \u5DF2\u5728 profile \u4E2D\u58F0\u660E\uFF0C\u7C98\u8D34\u524D\u8BF7\u6539\u540D" : "");
      } else setNotice(`\u5BFC\u51FA\u5931\u8D25\uFF1A${r?.error || "\u672A\u77E5\u9519\u8BEF"}`);
    } catch (error) {
      setNotice(`\u5BFC\u51FA\u5931\u8D25\uFF1A${String(error?.message || error)}`);
    } finally {
      setBusyLocal("");
    }
  }, []);
  const loadTools = (0, import_react4.useCallback)(async (entry) => {
    setBusyLocal(`${entry.kind}/${entry.name}`);
    setNotice("");
    try {
      const r = await hub.connectorTools(entry.name);
      if (r?.ok) setToolInfo(r);
      else setNotice(`\u8BFB\u53D6\u5DE5\u5177\u6E05\u5355\u5931\u8D25\uFF1A${r?.error || "\u672A\u77E5\u9519\u8BEF"}`);
    } catch (error) {
      setNotice(`\u8BFB\u53D6\u5DE5\u5177\u6E05\u5355\u5931\u8D25\uFF1A${String(error?.message || error)}`);
    } finally {
      setBusyLocal("");
    }
  }, []);
  const connectorRevoke = (0, import_react4.useCallback)(async (entry) => {
    const key = `${entry.kind}/${entry.name}`;
    setBusyLocal(key);
    setNotice("");
    try {
      await hub.disableConnector(entry.name).catch(() => {
      });
      const r = await hub.connectorUnbind(entry.name);
      if (r?.ok) await unmountHere(entry.kind, entry.name);
      setNotice(r?.ok ? `\u5DF2\u89E3\u7ED1\u300C${entry.displayName}\u300D` : `\u89E3\u7ED1\u5931\u8D25\uFF1A${r?.message || "\u5B98\u65B9\u672A\u786E\u8BA4"}`);
      const fresh = await hub.boundConnectors().catch(() => []);
      setBound(fresh.map((x) => x.name));
      await onRefresh?.();
    } catch (error) {
      setNotice(`\u89E3\u7ED1\u5931\u8D25\uFF1A${String(error?.message || error)}`);
    } finally {
      setBusyLocal("");
    }
  }, [onRefresh]);
  const pollOauth = (0, import_react4.useCallback)(async (entry) => {
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 3e3));
      try {
        const st = await hub.connectorOauthStatus(entry.name);
        if (st?.connected) {
          const fresh = await hub.boundConnectors().catch(() => []);
          setBound(fresh.map((x) => x.name));
          setPendingAuth(null);
          const ins = await hub.connectorInstall(entry.name).catch(() => null);
          const en = ins?.ok ? await hub.enableConnector(entry.name).catch(() => null) : null;
          setNotice(en?.ok ? `\u300C${entry.displayName}\u300D\u5DF2\u8FDE\u63A5\u5E76\u542F\u7528\uFF0C\u53EF\u5728\u5BF9\u8BDD\u4E2D\u4F7F\u7528` : `\u300C${entry.displayName}\u300D\u5DF2\u8FDE\u63A5\uFF08\u672C\u5730\u542F\u7528\uFF1A${ins?.flags?.[0] || en?.error || "\u5F85\u91CD\u8BD5"}\uFF09`);
          await onRefresh?.();
          return;
        }
      } catch {
      }
    }
    setNotice(`\u300C${entry.displayName}\u300D\u6388\u6743\u5C1A\u672A\u5B8C\u6210\uFF0C\u53EF\u7A0D\u540E\u91CD\u8BD5`);
  }, [onRefresh]);
  const connectAfterAuth = (0, import_react4.useCallback)(async (entry, what = "\u5DF2\u8FDE\u63A5") => {
    setPendingAuth(null);
    const source2 = entry.source === "desktop" ? "desktop" : void 0;
    const ins = await hub.connectorInstall(entry.name, source2).catch(() => null);
    const en = ins?.ok ? await hub.enableConnector(entry.name).catch(() => null) : null;
    if (en?.ok) {
      if (sessionId) await hub.mount(sessionId, entry.kind, entry.name).catch(() => {
      });
      addSelection(entry, sessionId);
    }
    setNotice(en?.ok ? `\u300C${entry.displayName}\u300D${what}\u5E76\u5DF2\u542F\u7528\uFF0C\u53EF\u5728\u5BF9\u8BDD\u4E2D\u4F7F\u7528` : `\u300C${entry.displayName}\u300D${what}\uFF08\u672C\u5730\u542F\u7528\u5931\u8D25\uFF1A${en?.error || ins?.flags?.[0] || "\u5F85\u91CD\u8BD5"}\uFF09`);
    await onRefresh?.();
  }, [onRefresh, sessionId]);
  const completeMcpOauth = (0, import_react4.useCallback)(async () => {
    const pending = pendingAuth;
    if (!pending?.mcpOauth) return;
    const url = String(pasteUrl || "").trim();
    if (!url) {
      setNotice("\u8BF7\u628A\u6D4F\u89C8\u5668\u5730\u5740\u680F\u91CC\u7684\u56DE\u8C03\u94FE\u63A5\u7C98\u8D34\u8FDB\u6765");
      return;
    }
    const r = await hub.mcpOauthComplete(pending.name, url).catch((error) => ({ ok: false, error: String(error?.message || error) }));
    if (!r?.ok) {
      setNotice(`\u5B8C\u6210\u6388\u6743\u5931\u8D25\uFF1A${r?.error || "\u672A\u77E5\u539F\u56E0"}`);
      return;
    }
    setPasteUrl("");
    const target = pending.entry || { kind: "connector", name: pending.name, displayName: pending.displayName, source: "desktop" };
    await connectAfterAuth(target, "\u5DF2\u6388\u6743");
  }, [pendingAuth, pasteUrl, connectAfterAuth]);
  const pollMcpOauth = (0, import_react4.useCallback)(async (entry) => {
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 3e3));
      let st = null;
      try {
        st = await hub.mcpOauthStatus(entry.name);
      } catch {
        continue;
      }
      const state = st?.status?.state;
      if (state === "done") {
        await connectAfterAuth(entry, "\u5DF2\u6388\u6743");
        return;
      }
      if (state === "error") {
        setPendingAuth(null);
        setNotice(`\u300C${entry.displayName}\u300D\u6388\u6743\u5931\u8D25\uFF1A${st?.status?.error || "\u672A\u77E5\u539F\u56E0"}`);
        return;
      }
    }
    setNotice(`\u300C${entry.displayName}\u300D\u6388\u6743\u5C1A\u672A\u5B8C\u6210\uFF0C\u53EF\u91CD\u65B0\u70B9\u300C\u8FDE\u63A5\u300D`);
  }, [connectAfterAuth]);
  const connectorAction = (0, import_react4.useCallback)(async (entry) => {
    const key = `${entry.kind}/${entry.name}`;
    if (isBound(entry)) {
      await connectorRevoke(entry);
      return;
    }
    setBusyLocal(key);
    setNotice("");
    const staleNow = authStale(authState());
    const desktopDirect = entry.source === "desktop" && entry.desktop?.endpoint === "direct";
    if (!desktopDirect && (authState()?.configured !== true || staleNow)) {
      setBusyLocal("");
      setNotice(staleNow ? `\u767B\u5F55\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u626B\u7801\u540E\u518D\u8FDE\u63A5\u300C${entry.displayName}\u300D` : `\u8FDE\u63A5\u300C${entry.displayName}\u300D\u9700\u8981 WorkBuddy \u8D26\u53F7\uFF0C\u8BF7\u626B\u7801\u767B\u5F55`);
      try {
        await requireAuth({
          reason: staleNow ? STALE_LOGIN_REASON : `\u8FDE\u63A5\u300C${entry.displayName}\u300D\u9700\u8981 WorkBuddy \u8D26\u53F7`,
          // 由发起动作的那个界面显示登录卡：page=市场页，picker=输入框「＋」
          surface: variant === "picker" ? "picker" : "page"
        });
      } catch (error) {
        setNotice(String(error?.message || error) === "\u7528\u6237\u53D6\u6D88\u4E86\u767B\u5F55" ? "\u5DF2\u53D6\u6D88\u767B\u5F55" : `\u65E0\u6CD5\u767B\u5F55\uFF1A${String(error?.message || error)}`);
        return;
      }
      setBusyLocal(key);
      setNotice("\u767B\u5F55\u6210\u529F\uFF0C\u6B63\u5728\u7EE7\u7EED\u2026");
    }
    if (entry.source === "desktop") {
      const rec = installed[`connector/${entry.name}`];
      let installResult = null;
      const probeHint = () => {
        const p = installResult?.probe;
        if (p && p.ok === false) {
          return `\uFF08\u7AEF\u70B9\u5B9E\u6D4B\uFF1A${[p.http ? `HTTP ${p.http}` : "", p.code ? `code=${p.code}` : "", p.error || ""].filter(Boolean).join(" ")}\uFF09`;
        }
        const flag = (installResult?.flags || []).find((x) => String(x).includes("\u7AEF\u70B9\u672A\u6D4B\u901A"));
        return flag ? `\uFF08${flag}\uFF09` : "";
      };
      const bound2 = isBound(entry);
      let authWindow2 = null;
      if (!bound2 && (entry.desktop?.credentialRefs || []).filter((r) => r !== "WORKBUDDY_TOKEN").length === 0) {
        try {
          authWindow2 = window.open("about:blank", "_blank");
        } catch {
          authWindow2 = null;
        }
      }
      const closeAuthWindow = () => {
        try {
          authWindow2?.close();
        } catch {
        }
      };
      const customRefs = (entry.desktop?.credentialRefs || []).filter((r) => r !== "WORKBUDDY_TOKEN");
      const fields = entry.desktop?.tokenFields || [];
      const credHint = customRefs.map((r) => {
        const f = fields.find((x) => x.key === r);
        return f?.label ? `${r}\uFF08${f.label}\uFF09` : r;
      }).join("\u3001");
      const enableOnly = async (authSkipReason) => {
        const en = await hub.enableConnector(entry.name).catch(() => null);
        if (en?.ok) {
          if (sessionId) await hub.mount(sessionId, entry.kind, entry.name).catch(() => {
          });
          addSelection(entry, sessionId);
          setNotice(`\u5DF2\u8FDE\u63A5\u300C${entry.displayName}\u300D\uFF08\u5DE5\u5177\u547D\u540D\u7A7A\u95F4 ${en.serverName || entry.name}\uFF09\uFF0C\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528`);
        } else {
          setNotice(`\u8FDE\u63A5\u300C${entry.displayName}\u300D\u5931\u8D25\uFF1A${en?.error || "\u672A\u77E5\u539F\u56E0"}${probeHint()}${authSkipReason ? `\uFF08\u5B98\u65B9\u8D26\u53F7\u4FA7\u4E0D\u8BA4\u8FD9\u6761\u8FDE\u63A5\u5668\uFF1A${authSkipReason}\uFF09` : ""}`);
        }
      };
      try {
        if (rec?.enabled) {
          await hub.disableConnector(entry.name);
          await unmountHere(entry.kind, entry.name);
          removeSelection(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u505C\u7528\u300C${entry.displayName}\u300D`);
        } else {
          installResult = await hub.connectorInstall(entry.name, "desktop").catch(() => null);
          if (!installResult?.ok) {
            closeAuthWindow();
            setNotice(`\u8FDE\u63A5\u300C${entry.displayName}\u300D\u5931\u8D25\uFF1A${installResult?.error || "\u672C\u5730\u767B\u8BB0\u5931\u8D25"}`);
          } else if (customRefs.length > 0) {
            closeAuthWindow();
            setNotice(`\u300C${entry.displayName}\u300D\u9700\u8981\u5148\u914D\u7F6E\u51ED\u636E\uFF1A${credHint}\uFF1B\u5728 DSH \u51ED\u636E\u7BA1\u7406\u91CC\u914D\u597D\u540E\u70B9\u300C\u8FDE\u63A5\u300D\u5373\u53EF`);
          } else {
            const m = await hub.mcpOauthStart(entry.name).catch(() => null);
            if (m?.ok && m.url) {
              if (authWindow2 && !authWindow2.closed) authWindow2.location.href = m.url;
              else {
                try {
                  window.open(m.url, "_blank");
                } catch {
                }
              }
              setPendingAuth({ name: entry.name, displayName: entry.displayName, url: m.url, entry, mcpOauth: true });
              setNotice(`\u8BF7\u5728\u6253\u5F00\u7684\u9875\u9762\u5B8C\u6210\u300C${entry.displayName}\u300D\u6388\u6743\uFF08\u626B\u7801\u6216\u767B\u5F55\uFF09\uFF0C\u5B8C\u6210\u540E\u4F1A\u81EA\u52A8\u8FDE\u63A5`);
              void pollMcpOauth(entry);
            } else if (m?.code === "already-usable") {
              closeAuthWindow();
              await enableOnly("");
            } else if (m && m.code !== "not-mcp-oauth") {
              closeAuthWindow();
              setNotice(`\u300C${entry.displayName}\u300D\u7684 MCP OAuth \u672A\u5C31\u7EEA\uFF1A${m.error || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0"}\uFF1B\u6B63\u5728\u5C1D\u8BD5\u76F4\u63A5\u542F\u7528\u2026`);
              await enableOnly(m.error || "MCP OAuth \u672A\u5C31\u7EEA");
            } else {
              const r = await hub.connectorAuthStart(entry.name).catch(() => null);
              if (r?.ok && r.url) {
                if (authWindow2 && !authWindow2.closed) authWindow2.location.href = r.url;
                else {
                  try {
                    window.open(r.url, "_blank");
                  } catch {
                  }
                }
                setPendingAuth({ name: entry.name, displayName: entry.displayName, url: r.url });
                setNotice(`\u8BF7\u5728\u6253\u5F00\u7684\u9875\u9762\u5B8C\u6210\u300C${entry.displayName}\u300D\u6388\u6743\uFF1B\u5B8C\u6210\u540E\u70B9\u300C\u8FDE\u63A5\u300D\u5373\u53EF\u5EFA\u7ACB\u8FDE\u63A5`);
                void pollOauth(entry);
              } else {
                closeAuthWindow();
                await enableOnly(r?.message || "\u672A\u6536\u5F55\uFF08\u65E0\u6CD5\u53D1\u8D77\u6388\u6743\uFF09");
              }
            }
          }
        }
      } finally {
        try {
          await onRefresh?.();
        } catch {
        }
        setBusyLocal("");
      }
      return;
    }
    let authWindow = null;
    if (!isBound(entry)) {
      try {
        authWindow = window.open("about:blank", "_blank");
      } catch {
        authWindow = null;
      }
    }
    try {
      if (isBound(entry)) {
        const rec = installed[`connector/${entry.name}`];
        if (rec?.enabled) {
          await hub.disableConnector(entry.name);
          await unmountHere(entry.kind, entry.name);
          removeSelection(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u505C\u7528\u300C${entry.displayName}\u300D\uFF08\u5B98\u65B9\u6388\u6743\u4ECD\u4FDD\u7559\uFF09`);
        } else {
          const ins = await hub.connectorInstall(entry.name);
          if (!ins?.ok) setNotice(`\u542F\u7528\u5931\u8D25\uFF1A${ins?.error || "\u672C\u5730\u767B\u8BB0\u5931\u8D25"}`);
          else {
            const en = await hub.enableConnector(entry.name);
            if (en?.ok) {
              if (sessionId) await hub.mount(sessionId, entry.kind, entry.name).catch(() => {
              });
              addSelection(entry, sessionId);
              setNotice(`\u5DF2\u542F\u7528\u300C${entry.displayName}\u300D\uFF0C\u5DF2\u52A0\u5230\u672C\u4F1A\u8BDD\uFF0C\u5DE5\u5177\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528`);
            } else {
              setNotice(`\u542F\u7528\u5931\u8D25\uFF1A${en?.error || ""}`);
            }
          }
        }
        await onRefresh?.();
        return;
      }
      if (isBound(entry)) {
        const r = await hub.connectorUnbind(entry.name);
        if (r?.ok) await unmountHere(entry.kind, entry.name);
        setNotice(r?.ok ? `\u5DF2\u89E3\u7ED1\u300C${entry.displayName}\u300D` : `\u89E3\u7ED1\u5931\u8D25\uFF1A${r?.message || "\u5B98\u65B9\u672A\u786E\u8BA4"}`);
      } else {
        const r = await hub.connectorAuthStart(entry.name);
        if (r?.ok && r.url) {
          if (authWindow && !authWindow.closed) authWindow.location.href = r.url;
          setPendingAuth({ name: entry.name, displayName: entry.displayName, url: r.url });
          setNotice(`\u8BF7\u5728\u6253\u5F00\u7684\u9875\u9762\u5B8C\u6210\u300C${entry.displayName}\u300D\u6388\u6743\uFF1B\u82E5\u6CA1\u6709\u81EA\u52A8\u6253\u5F00\uFF0C\u70B9\u4E0B\u9762\u94FE\u63A5`);
          void pollOauth(entry);
        } else {
          try {
            authWindow?.close();
          } catch {
          }
          setNotice(`\u8FDE\u63A5\u300C${entry.displayName}\u300D\u5931\u8D25\uFF1A${r?.message || "\u5B98\u65B9\u672A\u8FD4\u56DE\u6388\u6743\u94FE\u63A5"}`);
        }
      }
      const fresh = await hub.boundConnectors().catch(() => []);
      setBound(fresh.map((x) => x.name));
      await onRefresh?.();
    } catch (error) {
      try {
        authWindow?.close();
      } catch {
      }
      setNotice(`\u64CD\u4F5C\u5931\u8D25\uFF1A${String(error?.message || error)}`);
      void refreshAuth();
    } finally {
      setBusyLocal("");
    }
  }, [isBound, onRefresh, installed, connectorRevoke]);
  const handleDetail = (0, import_react4.useCallback)((entry) => {
    if (entry.kind === "expert") {
      onDetail?.(entry);
      return;
    }
    setDetail(entry);
  }, [onDetail]);
  const handleSkillPick = (0, import_react4.useCallback)((entry) => {
    insertPromptIntoComposer(`/${entry.name} `);
    addSelection(entry, sessionId);
  }, [sessionId]);
  const togglePin = (0, import_react4.useCallback)((entry) => {
    const key = `${entry.kind}/${entry.name}`;
    setPinned((prev) => {
      const next = new Set(prev);
      const on = !next.has(key);
      if (on) next.add(key);
      else next.delete(key);
      try {
        localStorage.setItem("wbh-pinned", JSON.stringify([...next]));
      } catch {
      }
      setPinnedEntries((list) => {
        const nextList = on ? [...list.filter((x) => `${x.kind}/${x.name}` !== key), { kind: entry.kind, name: entry.name, displayName: entry.displayName, description: entry.description || "", icon: entry.icon || "" }] : list.filter((x) => `${x.kind}/${x.name}` !== key);
        try {
          localStorage.setItem("wbh-pinned-entries", JSON.stringify(nextList));
        } catch {
        }
        return nextList;
      });
      return next;
    });
  }, []);
  const expertFallback = (0, import_react4.useMemo)(() => {
    const seedText = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    let h2 = 0;
    for (const ch of seedText) h2 = h2 * 31 + ch.codePointAt(0) >>> 0;
    const pool = [...rows];
    const picked = [];
    while (picked.length < 5 && pool.length > 0) {
      h2 = h2 * 1103515245 + 12345 >>> 0;
      picked.push(pool.splice(h2 % pool.length, 1)[0]);
    }
    return picked;
  }, [rows]);
  const kindMeta = KINDS.find((k) => k.id === kind) || KINDS[0];
  const mcpOauthPaste = pendingAuth?.mcpOauth ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-oauthPaste" }, /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      value: pasteUrl,
      onChange: (e) => setPasteUrl(e.target.value),
      placeholder: "\u6388\u6743\u540E\u6D4F\u89C8\u5668\u505C\u5728 127.0.0.1 \u56DE\u8C03\u9875\uFF1F\u628A\u5730\u5740\u680F\u90A3\u6574\u6761\u94FE\u63A5\u7C98\u5230\u8FD9\u91CC",
      "aria-label": "\u7C98\u8D34\u56DE\u8C03\u94FE\u63A5"
    }
  ), /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "wb-button wb-button--secondary wb-button--small",
      disabled: !String(pasteUrl).trim(),
      onClick: () => void completeMcpOauth()
    },
    "\u5B8C\u6210\u6388\u6743"
  )) : null;
  const busyAll = busyLocal || busy;
  const loginCard = /* @__PURE__ */ import_react4.default.createElement(
    WbAuthCard,
    {
      variant: "inline",
      title: "\u767B\u5F55 WorkBuddy \u8D26\u53F7",
      reason: authStaleNow ? STALE_LOGIN_REASON : kind === "connector" ? "\u8FDE\u63A5\u5668\u76EE\u5F55\u3001\u8D26\u53F7\u7ED1\u5B9A\u4E0E\u6388\u6743\u9700\u8981 WorkBuddy \u8D26\u53F7" : "\u6280\u80FD\u76EE\u5F55\u4E0E\u6280\u80FD\u5305\u4E0B\u8F7D\u9700\u8981 WorkBuddy \u8D26\u53F7"
    }
  );
  const pageLoginGate = variant === "page" && kind === "skill" ? auth === null ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react4.default.createElement("p", null, "\u6B63\u5728\u8BFB\u53D6\u767B\u5F55\u72B6\u6001\u2026")) : loggedIn && !authStaleNow ? null : /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-loginGate" }, loginCard) : null;
  const connectorLoginBanner = variant === "page" && kind === "connector" && auth !== null && !(loggedIn && !authStaleNow) ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-loginGate" }, loginCard, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-sourceNote" }, "\u672A\u767B\u5F55\u4E5F\u80FD\u6D4F\u89C8\u300C\u684C\u9762\u76EE\u5F55\u300D\u6765\u6E90\u7684\u8FDE\u63A5\u5668\uFF08WorkBuddy \u5BA2\u6237\u7AEF\u81EA\u5E26\u5E02\u573A\u7684\u516C\u5F00\u5305\uFF09\uFF1B\u5B98\u65B9\u6CE8\u518C\u8868\u6761\u76EE\u4E0E\u7F51\u5173\u578B\u8FDE\u63A5\u5668\u7684\u901A\u8BDD\u9700\u8981\u767B\u5F55\u540E\u6388\u6743\u3002")) : null;
  const sourceNote = kind === "connector" && loggedIn && source === "mirror" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-sourceNote" }, "\u5B98\u65B9\u8FDE\u63A5\u5668\u63A5\u53E3\u6682\u4E0D\u53EF\u7528\uFF0C\u5F53\u524D\u663E\u793A\u955C\u50CF\u76EE\u5F55\uFF08source: mirror\uFF09") : kind === "connector" && loggedIn && sourceCounts.desktop !== null ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-sourceNote" }, "\u5B98\u65B9\u6CE8\u518C\u8868 ", sourceCounts.official ?? 0, " \u6761", sourceCounts.desktop > 0 ? ` \xB7 \u684C\u9762\u7AEF\u516C\u5F00\u76EE\u5F55\u65B0\u589E ${sourceCounts.desktop} \u6761\uFF08WorkBuddy \u5BA2\u6237\u7AEF\u81EA\u5E26\u5E02\u573A\uFF0C\u6807\u300C\u684C\u9762\u76EE\u5F55\u300D\u7684\u884C\u6765\u81EA\u5B83${sourceCounts.duplicates > 0 ? `\uFF1B\u53E6\u6709 ${sourceCounts.duplicates} \u6761\u4E0E\u5B98\u65B9\u662F\u540C\u4E00\u8FDE\u63A5\u5668\uFF0C\u5DF2\u53BB\u91CD` : ""}\uFF09` : " \xB7 \u684C\u9762\u7AEF\u516C\u5F00\u76EE\u5F55\u672A\u542F\u7528\u6216\u6682\u4E0D\u53EF\u7528", sourceCounts.desktopMeta?.stale ? "\uFF08\u76EE\u5F55\u4E3A\u672C\u5730\u7F13\u5B58\uFF09" : "") : null;
  const skeletonCards = /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ import_react4.default.createElement("div", { key: i, className: "wbh-skelCard" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelHead" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelAvatar" }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelLines" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelRow", style: { width: "45%" } }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelRow short" }))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelRow" }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-skelRow short" }))));
  const kindTabs = /* @__PURE__ */ import_react4.default.createElement("div", { className: "um-header__tabs ec-topbar__left", role: "tablist" }, KINDS.map((k) => /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      key: k.id,
      type: "button",
      role: "tab",
      "aria-selected": kind === k.id,
      className: `um-tab${kind === k.id ? " um-tab--active" : ""}`,
      "data-track-name": "\u4E13\u5BB6/\u6280\u80FD/\u8FDE\u63A5\u5668",
      onClick: () => onKind(k.id)
    },
    /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: TAB_ICON[k.id], size: 14 }),
    /* @__PURE__ */ import_react4.default.createElement("span", null, k.label)
  )));
  const trimmedQuery = String(query ?? "").trim();
  (0, import_react4.useEffect)(() => {
    setSegment(0);
  }, [trimmedQuery]);
  const searchBox = /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-search-wrapper" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "wb-input-wrapper wb-input-wrapper--medium" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "wb-input__prefix" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "searchFilled", size: 14 })), /* @__PURE__ */ import_react4.default.createElement(
    "input",
    {
      className: "wb-input__inner",
      value: query,
      placeholder: SEARCH_PLACEHOLDER[kind],
      "aria-label": `\u641C\u7D22${kindMeta.label}`,
      onChange: (e) => onQuery(e.target.value)
    }
  )));
  const sortGroup = kind === "expert" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-sort-group", role: "tablist", "aria-label": "\u6392\u5E8F" }, SORTS.map((s) => /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      key: s.id,
      type: "button",
      role: "tab",
      "aria-selected": sort === s.id,
      className: `ec-sort-btn${sort === s.id ? " is-active" : ""}`,
      onClick: () => setSort(s.id)
    },
    s.label
  ))) : null;
  const categoryChips = kind === "skill" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "category-chip-list" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: `category-chip${category === "" ? " category-chip--active" : ""}`, onClick: () => setCategory("") }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "category-chip-label" }, "\u5168\u90E8")), categories.map((c) => /* @__PURE__ */ import_react4.default.createElement("button", { key: c.id, type: "button", className: `category-chip${category === c.id ? " category-chip--active" : ""}`, onClick: () => setCategory(c.id) }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "category-chip-label" }, c.label)))) : kind === "expert" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-category-tabs-wrap" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-category-tabs" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: `ec-category-tab${category === "" ? " is-active" : ""}`, onClick: () => setCategory("") }, "\u5168\u90E8"), categories.map((c) => /* @__PURE__ */ import_react4.default.createElement("button", { key: c.id, type: "button", className: `ec-category-tab${category === c.id ? " is-active" : ""}`, onClick: () => setCategory(c.id) }, c.label, c.count != null ? /* @__PURE__ */ import_react4.default.createElement("span", { className: "ec-category-tab-count" }, "(", c.count, ")") : null)))) : null;
  const cardGrid = kind === "expert" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-expert-grid" }, loading && skeletonCards, !loading && failed && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, "\u8BFB\u53D6\u5931\u8D25\uFF1A", failed), !loading && !failed && visible.length === 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: kindMeta.icon, size: 40 }), /* @__PURE__ */ import_react4.default.createElement("p", null, String(query).trim() ? `\u6CA1\u6709\u627E\u5230\u4E0E\u300C${String(query).trim()}\u300D\u5339\u914D\u7684${kindMeta.label}\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD` : `\u6682\u65E0\u8BE5\u5206\u7C7B\u7684\u6761\u76EE`)), visible.map((entry) => /* @__PURE__ */ import_react4.default.createElement(
    ExpertCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      kindLabel: kindMeta.label,
      busy,
      onDetail: handleDetail,
      onAction
    }
  )), loadingMore && skeletonCards) : /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-grid" }, loading && skeletonCards, !loading && failed && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, "\u8BFB\u53D6\u5931\u8D25\uFF1A", failed), !loading && !failed && visible.length === 0 && // 与专家页同口径：有搜索词给「没找到」，没搜索词才是「暂无」——
  // 搜索无命中时「暂无技能」读起来像目录本身空了，误导。
  /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: kindMeta.icon, size: 40 }), /* @__PURE__ */ import_react4.default.createElement("p", null, trimmedQuery ? `\u6CA1\u6709\u627E\u5230\u4E0E\u300C${trimmedQuery}\u300D\u5339\u914D\u7684${kindMeta.label}\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD` : `\u6682\u65E0${kindMeta.label}`)), visible.map((entry) => kind === "connector" ? /* @__PURE__ */ import_react4.default.createElement(ConnectorCard, { key: `${entry.kind}/${entry.name}`, entry, busy: busyAll, onDetail: handleDetail, onAction, onConnectorAction: connectorAction, bound }) : /* @__PURE__ */ import_react4.default.createElement(SkillCard, { key: `${entry.kind}/${entry.name}`, entry, busy, onDetail: handleDetail, onAction })), loadingMore && skeletonCards);
  const featuredSection = /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-featured-section" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-featured-header" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-featured-title" }, "\u7CBE\u9009\u6280\u80FD"), /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "skills-featured-refresh-btn",
      onClick: () => setFeatured([...rows].sort(() => Math.random() - 0.5).slice(0, 5))
    },
    /* @__PURE__ */ import_react4.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: "14", height: "14" }, /* @__PURE__ */ import_react4.default.createElement("path", { d: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" })),
    /* @__PURE__ */ import_react4.default.createElement("span", null, "\u6362\u4E00\u6362")
  )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-grid" }, featured.map((entry) => /* @__PURE__ */ import_react4.default.createElement(SkillCard, { key: `f-${entry.kind}/${entry.name}`, entry, busy, onDetail: handleDetail, onAction }))));
  const segmentBar = /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-segment-bar" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-segment-group" }, ["\u63A8\u8350", "\u5957\u4EF6"].map((label, i) => /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      key: label,
      type: "button",
      className: `skills-segment-item${segment === i ? " skills-segment-item--active" : ""}`,
      onClick: () => setSegment(i)
    },
    label
  ))));
  const skillDetailView = detail && detail.kind === "skill" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-view skills-view--detail" }, /* @__PURE__ */ import_react4.default.createElement("header", { className: "workbuddy-topbar ec-topbar ec-topbar--subpage" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-topbar__left" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "ec-topbar__back", onClick: () => setDetail(null) }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "chevronLeft", size: 14 }), "\u6280\u80FD"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-view" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "skill-detail-back", onClick: () => setDetail(null), hidden: true }, "\u6280\u80FD"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-header" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-header-main" }, /* @__PURE__ */ import_react4.default.createElement("h2", null, detail.displayName), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-actions" }, /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "skillhub-install-btn skillhub-install-btn--install",
      onClick: () => onAction?.(detail)
    },
    busy === `${detail.kind}/${detail.name}` ? "\u5B89\u88C5\u4E2D\u2026" : "\u5B89\u88C5"
  ))), /* @__PURE__ */ import_react4.default.createElement("p", null, detail.description || detail.name)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-content-box" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-toolbar" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "active" }, "\u6982\u89C8")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-preview" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-meta-grid" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-meta-item" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-label" }, "name"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-value" }, detail.name)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-meta-item" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-label" }, "version"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-value" }, detail.version || "1.0.0")), detail.subtitle ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "skill-detail-meta-item" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-label" }, "profession"), /* @__PURE__ */ import_react4.default.createElement("span", { className: "skill-detail-meta-value" }, detail.subtitle)) : null))))) : null;
  const connectorDetailModal = detail && detail.kind === "connector" ? /* @__PURE__ */ import_react4.default.createElement(
    "div",
    {
      className: "connector-detail-overlay connector-detail-modal-overlay",
      onClick: () => setDetail(null)
    },
    /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: `connector-detail-modal${isBound(detail) ? " connector-detail-modal--connected" : ""}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": detail.displayName,
        onClick: (e) => e.stopPropagation()
      },
      /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "connector-detail-close", "aria-label": "\u5173\u95ED", onClick: () => setDetail(null) }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "close", size: 16 })),
      /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-modal-fade", "aria-hidden": "true" }),
      /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-modal-bottom-fade", "aria-hidden": "true" }),
      /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-modal-body" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-flow" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-flow-avatar connector-detail-flow-avatar--workbuddy" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flowBrand" }, "W")), /* @__PURE__ */ import_react4.default.createElement("span", { className: "connector-detail-flow-icon", "aria-hidden": "true" }, /* @__PURE__ */ import_react4.default.createElement("span", null), /* @__PURE__ */ import_react4.default.createElement("span", null), /* @__PURE__ */ import_react4.default.createElement("span", null)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-flow-avatar connector-detail-flow-avatar--connector" }, /* @__PURE__ */ import_react4.default.createElement(EntryIcon, { entry: detail, size: 28, round: true }))), /* @__PURE__ */ import_react4.default.createElement("h3", { className: "connector-detail-name" }, detail.displayName), /* @__PURE__ */ import_react4.default.createElement("p", { className: "connector-detail-desc" }, detail.description || detail.name), detail.desktop ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-sourceNote", style: { marginTop: 8, textAlign: "left" } }, "\u6765\u6E90\uFF1AWorkBuddy \u684C\u9762\u7AEF\u516C\u5F00\u76EE\u5F55", detail.desktop.endpoint === "gateway" ? " \xB7 \u8D70 WorkBuddy agent-gateway\uFF08\u51ED\u636E\u7531\u8D26\u53F7\u4FA7\u4FDD\u5B58\uFF0C\u9700\u5148\u5728\u8D26\u53F7\u91CC\u6388\u6743\uFF09" : detail.desktop.endpoint === "direct" ? " \xB7 \u76F4\u8FDE\u4E0A\u6E38\u670D\u52A1\uFF08\u51ED\u636E\u7531\u4F60\u5728 DSH \u51ED\u636E\u5E93\u914D\u7F6E\uFF09" : "", detail.desktop.credentialRefs?.length ? ` \xB7 \u9700\u8981\u51ED\u636E\uFF1A${detail.desktop.credentialRefs.filter((r) => r !== "WORKBUDDY_TOKEN").join("\u3001") || "WorkBuddy \u8D26\u53F7"}` : "", detail.desktop.supported === false ? ` \xB7 \u4E0D\u53EF\u81EA\u52A8\u63A5\u5165\uFF1A${detail.desktop.unsupportedReason}` : "") : null, toolInfo ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-toolBox" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-toolHead" }, "\u8BE5\u8FDE\u63A5\u5668\u5411\u6A21\u578B\u66B4\u9732 ", /* @__PURE__ */ import_react4.default.createElement("b", null, toolInfo.count), " \u4E2A\u5DE5\u5177 \xB7 \u547D\u540D\u7A7A\u95F4 ", /* @__PURE__ */ import_react4.default.createElement("code", null, toolInfo.namespace)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-toolList" }, toolInfo.labelled.slice(0, 40).map((t) => /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-toolRow", key: t.name }, /* @__PURE__ */ import_react4.default.createElement("code", null, t.name), /* @__PURE__ */ import_react4.default.createElement("span", null, t.description)))), toolInfo.count > 40 ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-toolMore" }, "\u4EC5\u663E\u793A\u524D 40 \u4E2A\uFF0C\u5171 ", toolInfo.count, " \u4E2A") : null) : null, nativeRow ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-nativeRowBox" }, /* @__PURE__ */ import_react4.default.createElement("pre", { className: "wbh-nativeRow" }, nativeRow.row), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-nativeRowFoot" }, /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type: "button",
          className: "wb-button wb-button--secondary wb-button--small",
          onClick: () => {
            try {
              void navigator.clipboard?.writeText(nativeRow.row);
            } catch {
            }
          }
        },
        "\u590D\u5236"
      ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-nativeRowNote" }, nativeRow.note))) : null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "connector-detail-actions" }, /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type: "button",
          className: "connector-detail-btn connector-detail-btn--secondary connector-detail-btn--reset",
          disabled: busyLocal === `${detail.kind}/${detail.name}`,
          onClick: () => void (isBound(detail) ? connectorRevoke(detail) : connectorAction(detail))
        },
        isBound(detail) ? "\u89E3\u7ED1" : "\u8FDE\u63A5"
      ), /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type: "button",
          className: "wb-button wb-button--secondary wb-button--medium",
          disabled: busyLocal === `${detail.kind}/${detail.name}`,
          onClick: () => void exportNativeRow(detail)
        },
        "\u5BFC\u51FA\u539F\u751F MCP \u914D\u7F6E"
      ), /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type: "button",
          className: "wb-button wb-button--secondary wb-button--medium",
          disabled: busyLocal === `${detail.kind}/${detail.name}`,
          onClick: () => void loadTools(detail)
        },
        toolInfo ? `\u53EF\u7528\u5DE5\u5177 ${toolInfo.count}` : "\u67E5\u770B\u53EF\u7528\u5DE5\u5177"
      )))
    )
  ) : null;
  const installedGrid = /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-grid" }, hubSkills.length === 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react4.default.createElement("p", null, "\u8FD8\u6CA1\u6709\u901A\u8FC7 WorkBuddy Hub \u5B89\u88C5\u7684\u6280\u80FD")), hubSkills.map((entry) => /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-installedCard", key: entry.key }, /* @__PURE__ */ import_react4.default.createElement(SkillCard, { entry, busy, onDetail: handleDetail, onAction }), /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "wb-button wb-button--secondary wb-button--small wbh-uninstallBtn",
      onClick: async (e) => {
        e.stopPropagation();
        await hub.uninstall("skill", entry.name);
        await onRefresh?.();
      }
    },
    "\u5378\u8F7D"
  ))));
  const localGrid = /* @__PURE__ */ import_react4.default.createElement("div", { className: "skills-grid" }, localRows.length === 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react4.default.createElement("p", null, "\u672C\u673A ~/.dsh/skills \u4E0B\u6CA1\u6709\u53EF\u6DFB\u52A0\u7684\u6280\u80FD")), localRows.map((entry) => /* @__PURE__ */ import_react4.default.createElement(SkillCard, { key: `local-${entry.name}`, entry, busy, onDetail: handleDetail, onAction })));
  const skillTopRight = kind === "skill" ? /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "wb-button wb-button--secondary wb-button--medium",
      "aria-label": "\u6211\u5B89\u88C5\u7684",
      "aria-pressed": view === "installed",
      onClick: () => setView((v) => v === "installed" ? "market" : "installed")
    },
    /* @__PURE__ */ import_react4.default.createElement("span", { className: "wb-button__icon wb-button__icon--left" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "download", size: 14 })),
    "\u6211\u5B89\u88C5\u7684",
    hubSkills.length > 0 && /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-btnCount" }, hubSkills.length)
  ), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-addWrap" }, /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "wb-button wb-button--secondary wb-button--medium",
      "aria-label": "\u6DFB\u52A0\u6280\u80FD",
      "aria-haspopup": "menu",
      "aria-expanded": addMenu,
      onClick: () => setAddMenu((v) => !v)
    },
    /* @__PURE__ */ import_react4.default.createElement("span", { className: "wb-button__icon wb-button__icon--left" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "plus", size: 14 })),
    "\u6DFB\u52A0\u6280\u80FD"
  ), addMenu && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-addScrim", onClick: () => setAddMenu(false) }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-addMenu", role: "menu" }, /* @__PURE__ */ import_react4.default.createElement(
    "div",
    {
      className: "wbh-addMenuItem",
      role: "menuitem",
      tabIndex: 0,
      onClick: () => {
        setAddMenu(false);
        setView("local");
      }
    },
    /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "download", size: 14 }),
    "\u4ECE\u672C\u5730\u6DFB\u52A0\u6280\u80FD"
  ), /* @__PURE__ */ import_react4.default.createElement(
    "div",
    {
      className: "wbh-addMenuItem",
      role: "menuitem",
      tabIndex: 0,
      onClick: () => {
        setAddMenu(false);
        setView("installed");
      }
    },
    /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "gear", size: 14 }),
    "\u7BA1\u7406\u6280\u80FD"
  ))))) : null;
  if (variant === "picker") {
    const footerNode = kind === "connector" ? /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "wbh-flyoutFooterItem",
        role: "menuitem",
        tabIndex: 0,
        onClick: () => openMarket({ kind: "connector", view: "market" })
      },
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterIcon" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "connManage", size: 16 })),
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterLabel" }, "\u7BA1\u7406\u8FDE\u63A5\u5668")
    ) : kind === "expert" ? (
      /* 「召唤更多专家」在 picker 里**弹小窗口**（内容 = 市场页目录），弹窗里的召唤直接
         加载到打开它的那个对话 —— 由父组件注入 onMore；没有注入时退回旧行为（跳市场页）。 */
      /* @__PURE__ */ import_react4.default.createElement(
        "div",
        {
          className: "wbh-flyoutFooterItem",
          role: "menuitem",
          tabIndex: 0,
          onClick: (e) => {
            e.stopPropagation();
            if (onMore) onMore("expert");
            else openMarket({ kind: "expert", view: "market" });
          }
        },
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterIcon" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "summonMore", size: 16 })),
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterLabel" }, "\u53EC\u5524\u66F4\u591A\u4E13\u5BB6")
      )
    ) : /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "wbh-flyoutFooterItem",
        role: "menuitem",
        tabIndex: 0,
        onClick: (e) => {
          e.stopPropagation();
          openMarket({ kind: "skill", view: "local" });
        }
      },
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterIcon" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "skillUpload", size: 16 })),
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterLabel" }, "\u4ECE\u672C\u5730\u6DFB\u52A0\u6280\u80FD")
    ), /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "wbh-flyoutFooterItem",
        role: "menuitem",
        tabIndex: 0,
        onClick: (e) => {
          e.stopPropagation();
          openMarket({ kind: "skill", view: "installed" });
        }
      },
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterIcon" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "skillManage", size: 16 })),
      /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutFooterLabel" }, "\u7BA1\u7406\u6280\u80FD")
    ));
    const installedExperts = Object.entries(installed).filter(([, rec]) => rec?.kind === "expert").map(([key, rec]) => ({ key, kind: "expert", name: rec.name || key.split("/")[1], displayName: rec.displayName || rec.name, description: rec.description || "", icon: rec.icon || "" }));
    const localSkills = query ? localRows.filter((e) => (e.displayName || e.name || "").toLowerCase().includes(query.toLowerCase())) : localRows;
    const baseRows = kind === "expert" ? String(query ?? "").trim() ? visible : installedExperts.length ? installedExperts : expertFallback : kind === "skill" ? localSkills : visible;
    const activeQuery = String(query ?? "").trim().toLowerCase();
    const matchesQuery = (x) => activeQuery === "" || [x.name, x.displayName, x.description].some((v) => String(v || "").toLowerCase().includes(activeQuery));
    const pinnedOfKind = pinnedEntries.filter((x) => x.kind === kind && matchesQuery(x));
    const merged = [...pinnedOfKind, ...baseRows.filter((b) => !pinnedOfKind.some((p) => p.name === b.name && p.kind === b.kind))];
    const rowRank = (x) => {
      if (x.kind === "connector") {
        if (installed[`connector/${x.name}`]?.enabled) return 0;
        if (bound.includes(x.name)) return 1;
      }
      if (pinned.has(`${x.kind}/${x.name}`)) return 2;
      return 3;
    };
    const recentExperts = kind === "expert" ? recentSnapshot : [];
    const recencyRank = (name) => {
      const i = recentExperts.indexOf(name);
      return i < 0 ? Number.MAX_SAFE_INTEGER : i;
    };
    const visibleRows = [...merged].sort((a, b) => {
      const byRank = rowRank(a) - rowRank(b);
      if (byRank !== 0) return byRank;
      if (kind !== "expert") return 0;
      return recencyRank(a.name) - recencyRank(b.name);
    });
    const rowNode = (entry) => {
      const key = `${entry.kind}/${entry.name}`;
      const connectorEnabled = entry.kind === "connector" ? Boolean(installed[`connector/${entry.name}`]?.enabled) : false;
      const connectorAuthorised = entry.kind === "connector" && bound.includes(entry.name);
      const connected = entry.kind === "connector" ? connectorEnabled : Boolean(entry._enabled || entry.isConnected);
      const isPinned = pinned.has(key);
      if (entry.kind === "expert") {
        const pickedRow = Boolean(mounted?.has?.(key));
        return /* @__PURE__ */ import_react4.default.createElement(
          "div",
          {
            key,
            role: "menuitem",
            tabIndex: 0,
            "aria-checked": pickedRow,
            className: `cr-experts-submenu__item${pickedRow ? " cr-experts-submenu__item--selected" : ""}`,
            onClick: () => onAction?.(entry),
            onKeyDown: (e) => {
              if (e.key === "Enter") onAction?.(entry);
            }
          },
          /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-experts-submenu__avatar", "aria-hidden": "true" }, /* @__PURE__ */ import_react4.default.createElement(
            EntryIcon,
            {
              entry,
              size: 16,
              round: false,
              fallbackTint: PICKER_TINT[entry.kind],
              radius: "6px"
            }
          )),
          /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-experts-submenu__name" }, entry.displayName),
          /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: `cr-experts-submenu__pin${isPinned ? " cr-experts-submenu__pin--active" : ""}`,
              "aria-label": isPinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePin(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-experts-submenu__pin-icon-rest" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinRest", size: 14 })),
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-experts-submenu__pin-icon-hover" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinHover", size: 14 }))
          )
        );
      }
      if (entry.kind === "skill") {
        return /* @__PURE__ */ import_react4.default.createElement(
          "div",
          {
            key,
            role: "menuitem",
            tabIndex: 0,
            className: `cr-skills-submenu__item${entry.description ? "" : " cr-skills-submenu__item--single"}`,
            onClick: () => handleSkillPick(entry),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSkillPick(entry);
              }
            }
          },
          /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-skills-submenu__item-icon", onDragStart: (e) => e.preventDefault() }, /* @__PURE__ */ import_react4.default.createElement(
            EntryIcon,
            {
              entry,
              size: 16,
              round: false,
              fallbackTint: PICKER_TINT[entry.kind],
              radius: "6px"
            }
          )),
          /* @__PURE__ */ import_react4.default.createElement("div", { className: "cr-skills-submenu__item-body" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "cr-skills-submenu__item-title" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-skills-submenu__item-name" }, entry.displayName)), entry.description ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "cr-skills-submenu__item-desc" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-skills-submenu__item-desc-text" }, entry.description)) : null),
          /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: `cr-skills-submenu__pin-btn${isPinned ? " cr-skills-submenu__pin-btn--pinned" : ""}`,
              "aria-pressed": isPinned,
              "aria-label": isPinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876",
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePin(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-skills-submenu__pin-icon-rest", "aria-hidden": "true" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinRest", size: 14 })),
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-skills-submenu__pin-icon-hover", "aria-hidden": "true" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinHover", size: 14 }))
          )
        );
      }
      if (entry.kind === "connector") {
        return /* @__PURE__ */ import_react4.default.createElement(
          "div",
          {
            key,
            role: "menuitem",
            tabIndex: 0,
            className: `cr-connectors-submenu__item${connectorEnabled || connectorAuthorised ? "" : " cr-connectors-submenu__item--disabled"}`,
            onClick: () => onAction?.(entry),
            onKeyDown: (e) => {
              if (e.key === "Enter") onAction?.(entry);
            }
          },
          /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__item-icon" }, /* @__PURE__ */ import_react4.default.createElement(
            EntryIcon,
            {
              entry,
              size: 16,
              round: false,
              fallbackTint: PICKER_TINT[entry.kind],
              radius: "3px"
            }
          )),
          /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__item-name" }, entry.displayName),
          connectorEnabled || connectorAuthorised ? /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__row-switch" }, /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: `wbh-toggle${connectorEnabled ? " is-on" : ""}`,
              role: "switch",
              "aria-checked": connectorEnabled,
              "aria-label": `${connectorEnabled ? "\u505C\u7528" : "\u542F\u7528"} ${entry.displayName}`,
              disabled: busyLocal === key,
              onClick: (e) => {
                e.stopPropagation();
                void connectorAction(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("i", null)
          )) : /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: "cr-connectors-submenu__suffix-connect",
              disabled: busyLocal === key,
              "aria-label": `\u8FDE\u63A5 ${entry.displayName}`,
              onClick: (e) => {
                e.stopPropagation();
                void connectorAction(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__suffix-connect-icon" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "connLink", size: 14 })),
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__suffix-connect-label" }, "\u8FDE\u63A5")
          ),
          busyLocal === key && /* @__PURE__ */ import_react4.default.createElement("span", { className: "cr-connectors-submenu__connecting-spinner" }, "\u2026")
        );
      }
      return (
        // 点击整行 = attach（与回车一致）：连接器挂到当前会话并出 chip；技能写输入框；
        // 专家走 onAction（召唤）。行内开关只承载「启/停用」这一种语义（见行尾）。
        /* @__PURE__ */ import_react4.default.createElement(
          "div",
          {
            key,
            className: `wbh-flyoutRow is-${entry.kind}`,
            role: "menuitem",
            tabIndex: 0,
            onClick: () => {
              if (entry.kind === "skill") handleSkillPick(entry);
              else onAction?.(entry);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") onAction?.(entry);
            }
          },
          /* @__PURE__ */ import_react4.default.createElement("span", { className: `wbh-flyoutIcon${entry.kind === "expert" ? " is-round" : ""}` }, /* @__PURE__ */ import_react4.default.createElement(
            EntryIcon,
            {
              entry,
              size: 16,
              round: entry.kind === "expert",
              fallbackTint: PICKER_TINT[entry.kind],
              radius: entry.kind === "expert" ? "50%" : entry.kind === "skill" ? "6px" : "3px"
            }
          )),
          entry.kind === "skill" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-rowBody" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-rowTitle" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-rowTitleText" }, entry.displayName)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-rowDesc" }, entry.description || "")) : /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutName" }, entry.displayName),
          entry.kind !== "connector" && /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: `wbh-pinBtn${isPinned ? " is-pinned" : ""}`,
              "aria-label": isPinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876",
              onClick: (e) => {
                e.stopPropagation();
                togglePin(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-pinRest" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinRest", size: 16 })),
            /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-pinHover" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "pinHover", size: 16 }))
          ),
          entry.kind === "connector" && (connectorEnabled || connectorAuthorised ? /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: `wbh-toggle${connectorEnabled ? " is-on" : ""}`,
              role: "switch",
              "aria-checked": connectorEnabled,
              "aria-label": `${connectorEnabled ? "\u505C\u7528" : "\u542F\u7528"} ${entry.displayName}`,
              disabled: busyLocal === key,
              onClick: (e) => {
                e.stopPropagation();
                void connectorAction(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement("i", null)
          ) : /* @__PURE__ */ import_react4.default.createElement(
            "button",
            {
              type: "button",
              className: "wbh-linkAction",
              disabled: busyLocal === key,
              "aria-label": `\u8FDE\u63A5 ${entry.displayName}`,
              onClick: (e) => {
                e.stopPropagation();
                void connectorAction(entry);
              }
            },
            /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "connLink", size: 14 }),
            /* @__PURE__ */ import_react4.default.createElement("span", null, "\u8FDE\u63A5")
          )),
          busyLocal === key && /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutBusy" }, "\u2026")
        )
      );
    };
    const hostMcpRows = variant === "picker" && kind === "connector" ? hostMcp.filter((s) => s && s.source !== "connector") : [];
    const hostMcpSection = hostMcpRows.length > 0 ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-mcpSection" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-mcpSectionTitle" }, "\u672C\u673A MCP"), hostMcpRows.map((server) => {
      const key = `mcp/${server.name}`;
      const managed = Boolean(server.managed);
      return /* @__PURE__ */ import_react4.default.createElement(
        "div",
        {
          key,
          className: "wbh-flyoutRow is-mcp",
          role: "menuitem",
          tabIndex: managed ? 0 : -1,
          onClick: managed ? () => void localMcpAction(server) : void 0,
          onKeyDown: managed ? ((e) => {
            if (e.key === "Enter") void localMcpAction(server);
          }) : void 0
        },
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutIcon is-mcp" }, /* @__PURE__ */ import_react4.default.createElement(PickIcon, { name: "connLink", size: 16 })),
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-flyoutName" }, server.name),
        /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-mcpMeta" }, server.source === "dsh" ? "DSH \u52A0\u8F7D" : "\u672C\u63D2\u4EF6\u6258\u7BA1", " \xB7 ", Number(server.toolCount) || 0, " \u4E2A\u5DE5\u5177"),
        managed ? /* @__PURE__ */ import_react4.default.createElement(
          "button",
          {
            type: "button",
            className: `wbh-toggle${server.enabled ? " is-on" : ""}`,
            role: "switch",
            "aria-checked": Boolean(server.enabled),
            "aria-label": `${server.enabled ? "\u505C\u7528" : "\u542F\u7528"} ${server.name}`,
            disabled: busyLocal === key,
            onClick: (e) => {
              e.stopPropagation();
              void localMcpAction(server);
            }
          },
          /* @__PURE__ */ import_react4.default.createElement("i", null)
        ) : /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-mcpBadge", title: server.note || "" }, "\u53EA\u8BFB")
      );
    })) : null;
    const listNode = /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__list`, ref: scrollRef, onScroll }, hostMcpSection, loading && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-flyoutState" }, "\u6B63\u5728\u8BFB\u53D6\u2026"), !loading && !failed && visibleRows.length === 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__empty` }, String(query).trim() ? `\u6CA1\u6709\u627E\u5230\u4E0E\u300C${String(query).trim()}\u300D\u5339\u914D\u7684${kindMeta.label}` : `\u6682\u65E0\u53EF\u7528${kindMeta.label}`), visibleRows.map(rowNode), loadingMore && /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__load-more`, role: "status" }, "\u52A0\u8F7D\u4E2D\u2026"));
    return /* @__PURE__ */ import_react4.default.createElement("div", { className: `wbh-flyout wbh-port ${CR_ROOT[kind] || ""} is-${kind}`, role: "dialog", "aria-label": `\u9009\u62E9${kindMeta.label}` }, notice ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-notice" }, notice) : null, pendingAuth ? /* @__PURE__ */ import_react4.default.createElement("a", { className: "wbh-authLink", href: pendingAuth.url, target: "_blank", rel: "noreferrer" }, "\u6253\u5F00\u300C", pendingAuth.displayName, "\u300D\u6388\u6743\u9875") : null, mcpOauthPaste, /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__search` }, /* @__PURE__ */ import_react4.default.createElement(
      "input",
      {
        className: "cr-search-input",
        value: query,
        placeholder: `\u641C\u7D22${kindMeta.label}`,
        "aria-label": `\u641C\u7D22${kindMeta.label}`,
        onChange: (e) => onQuery(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape" && query) {
            e.stopPropagation();
            onQuery("");
          }
        }
      }
    )), kind === "skill" ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-flyoutBody" }, listNode) : listNode, /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__divider`, role: "separator" }), /* @__PURE__ */ import_react4.default.createElement("div", { className: `${CR_ROOT[kind]}__footer` }, footerNode, footerExtra));
  }
  if (detail && detail.kind === "skill") return skillDetailView;
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-market-panel" }, /* @__PURE__ */ import_react4.default.createElement("header", { className: "ec-topbar" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-topbar__left" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "um-header__inner" }, kindTabs)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-topbar__right" }, searchBox, topbarRight, skillTopRight)), notice ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-notice wbh-notice--page" }, notice) : null, pendingAuth ? /* @__PURE__ */ import_react4.default.createElement("a", { className: "wbh-authLink wbh-authLink--page", href: pendingAuth.url, target: "_blank", rel: "noreferrer" }, "\u6253\u5F00\u300C", pendingAuth.displayName, "\u300D\u6388\u6743\u9875") : null, mcpOauthPaste, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-page-layout" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-main-content" }, view !== "market" && /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-viewBar" }, /* @__PURE__ */ import_react4.default.createElement(
    "button",
    {
      type: "button",
      className: "wb-button wb-button--secondary wb-button--small",
      onClick: () => setView("market")
    },
    "\u2190 \u8FD4\u56DE",
    kindMeta.label,
    "\u5E02\u573A"
  ), /* @__PURE__ */ import_react4.default.createElement("span", { className: "wbh-viewTitle" }, view === "installed" ? "\u6211\u5B89\u88C5\u7684" : "\u4ECE\u672C\u5730\u6DFB\u52A0\u6280\u80FD")), view === "market" && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, sortGroup ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-sortRow" }, sortGroup) : null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "wbh-filterRow" }, categoryChips)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-main-scroll", ref: scrollRef, onScroll }, view === "installed" ? installedGrid : view === "local" ? localGrid : pageLoginGate || skillDetailView || /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, connectorLoginBanner, sourceNote, kind === "skill" && !query && segment === 0 && featured.length > 0 && featuredSection, kind === "skill" && segmentBar, cardGrid)))), connectorDetailModal);
}

// src/SummonModal.jsx
var import_react5 = __toESM(require("react"), 1);
function SummonModal({ entry, busy, onClose, onConfirm, onQuickPrompt, onNewSession }) {
  const [task, setTask] = (0, import_react5.useState)("");
  const [fade, setFade] = (0, import_react5.useState)({ top: false, bottom: false });
  const shellRef = (0, import_react5.useRef)(null);
  const onScroll = (0, import_react5.useCallback)(() => {
    const el = shellRef.current?.querySelector(".ec-modal-body");
    if (!el) return;
    const top = el.scrollTop > 2;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    setFade((prev) => prev.top === top && prev.bottom === bottom ? prev : { top, bottom });
  }, []);
  const prompts = (entry.quickPrompts ?? []).slice(0, 3);
  const profession = entry.subtitle || "\u4E13\u5BB6";
  const useCount = entry.useCount ? `${entry.useCount}\u6B21\u4F7F\u7528` : "";
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-overlay", role: "dialog", "aria-modal": "true", "aria-label": `\u53EC\u5524 ${entry.displayName}` }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-card is-expert-view" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-top" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-avatar" }, entry.icon ? /* @__PURE__ */ import_react5.default.createElement("img", { src: entry.icon, alt: "" }) : /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-avatar-fallback" }, (entry.displayName || "?").slice(0, 1))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-info" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-title-row" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-role" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-role-primary" }, profession), /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-role-separator", "aria-hidden": "true" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-role-secondary" }, entry.displayName)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-actions" }, useCount && /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-use-count" }, useCount), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "ec-modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ import_react5.default.createElement(WbIcon, { name: "close", size: 14 })))), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      className: "ec-modal-summon-btn ec-modal-header-summon-btn",
      disabled: busy,
      onClick: () => onConfirm(task)
    },
    busy ? "\u53EC\u5524\u4E2D\u2026" : "\u53EC\u5524\u4E13\u5BB6"
  ), onNewSession && /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-newSessionBtn",
      disabled: busy,
      onClick: () => onNewSession()
    },
    busy ? "\u5904\u7406\u4E2D\u2026" : "\u5728\u65B0\u4F1A\u8BDD\u4E2D\u53EC\u5524\uFF08\u771F\u63A5\u7BA1\uFF09"
  ))), /* @__PURE__ */ import_react5.default.createElement("div", { className: `ec-modal-scroll-shell${fade.top ? " has-top-fade" : ""}${fade.bottom ? " has-bottom-fade" : ""}`, ref: shellRef }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-scroll-fade ec-modal-scroll-fade-top", "aria-hidden": "true" }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-body", onScroll }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-content" }, /* @__PURE__ */ import_react5.default.createElement("p", { className: "ec-modal-desc" }, entry.description || "\u4E13\u5BB6\u8FD0\u884C\u5728\u72EC\u7ACB\u4F1A\u8BDD\u4E2D\uFF0C\u4E3B\u5BF9\u8BDD\u53EA\u63A5\u6536\u7ED3\u8BBA\u3002"), entry.tags?.length > 0 && /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-tags-list" }, entry.tags.map((t) => /* @__PURE__ */ import_react5.default.createElement("span", { key: t, className: "ec-modal-tag-chip" }, t)))), prompts.length > 0 && /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-quick-prompts" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-section-title" }, "\u4E13\u5BB6\u5E2E\u4F60\u505A"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-quick-prompts-list" }, prompts.map((p, i) => /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      key: i,
      type: "button",
      className: "ec-modal-quick-prompt-btn",
      onClick: () => onQuickPrompt?.(p)
    },
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-quick-prompt-text" }, p),
    /* @__PURE__ */ import_react5.default.createElement("span", { className: "ec-modal-quick-prompt-action" }, /* @__PURE__ */ import_react5.default.createElement(WbIcon, { name: "chevronRight", size: 14 }))
  ))))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "ec-modal-scroll-fade ec-modal-scroll-fade-bottom", "aria-hidden": "true" }))));
}

// src/ConnectorAuthModal.jsx
var import_react6 = __toESM(require("react"), 1);
function ConnectorAuthModal({ entry, refs = [], error, authDomain = "", retryable = true, busy, onClose, onRetry }) {
  const domain = authDomain || entry?.cli?.authDomain || "";
  const authUrl = domain ? `https://${domain.replace(/^https?:\/\//, "")}` : "";
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-overlay", role: "dialog", "aria-modal": "true", "aria-label": `\u8FDE\u63A5 ${entry.displayName || entry.name}` }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-card", style: { opacity: 1 } }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-top" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-avatar" }, entry.icon ? /* @__PURE__ */ import_react6.default.createElement("img", { src: entry.icon, alt: "" }) : /* @__PURE__ */ import_react6.default.createElement("span", { className: "ec-modal-avatar-fallback" }, /* @__PURE__ */ import_react6.default.createElement(WbIcon, { name: "link", size: 22 }))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-info" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-title-row" }, /* @__PURE__ */ import_react6.default.createElement("h3", { className: "ec-modal-role" }, "\u8FDE\u63A5 ", entry.displayName || entry.name), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-actions" }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "ec-modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ import_react6.default.createElement(WbIcon, { name: "close", size: 14 })))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-meta" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "ec-modal-name" }, "\u6388\u6743\u5B8C\u6210\u540E\u56DE\u5230\u672C\u5BF9\u8BDD\u6846\u91CD\u8BD5")))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-scroll-shell" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-body" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-content" }, /* @__PURE__ */ import_react6.default.createElement("p", { className: "ec-modal-desc" }, error || entry.description || ""), refs.length > 0 ? /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-section-title", style: { marginTop: 14 } }, "\u8BE5\u8FDE\u63A5\u5668\u9700\u8981\u4EE5\u4E0B\u51ED\u8BC1"), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-tags-list" }, refs.map((r) => /* @__PURE__ */ import_react6.default.createElement("span", { key: r, className: "ec-modal-tag-chip", style: { fontFamily: "ui-monospace, monospace" } }, r)))) : !retryable ? /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-tags-list", style: { marginTop: 14 } }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "ec-modal-tag-chip" }, "CLI \xB7 \u6280\u80FD\u5DF2\u6302\u8F7D")) : null, /* @__PURE__ */ import_react6.default.createElement("p", { className: "ec-modal-desc", style: { marginTop: 14 } }, authUrl ? `\u8BE5\u8FDE\u63A5\u5668\u7684\u6388\u6743\u5165\u53E3\u5728 ${domain}\uFF1B\u70B9\u51FB\u300C\u6253\u5F00\u6388\u6743\u9875\u300D\u4F1A\u65B0\u5F00\u6807\u7B7E\u9875\uFF0C\u6388\u6743\u540E\u56DE\u6765\u91CD\u8BD5\u3002` : "\u51ED\u8BC1\u7531 DSH \u51ED\u8BC1\u7BA1\u7406\u6301\u6709\uFF1B\u914D\u7F6E\u540E\u70B9\u300C\u91CD\u8BD5\u8FDE\u63A5\u300D\u5373\u53EF\u3002")))), /* @__PURE__ */ import_react6.default.createElement("div", { className: "ec-modal-footer", style: { gap: 10 } }, /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: onClose }, "\u5173\u95ED"), authUrl && /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: () => window.open(authUrl, "_blank", "noopener") }, /* @__PURE__ */ import_react6.default.createElement(WbIcon, { name: "external", size: 13 }), " \u6253\u5F00\u6388\u6743\u9875"), retryable && /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "ec-modal-summon-btn", style: { width: "auto" }, disabled: busy, onClick: onRetry }, /* @__PURE__ */ import_react6.default.createElement(WbIcon, { name: "refresh", size: 13 }), " ", busy ? "\u8FDE\u63A5\u4E2D\u2026" : "\u91CD\u8BD5\u8FDE\u63A5"))));
}

// src/MarketPage.jsx
function AccountCapsule({ auth, onLogin }) {
  const [open, setOpen] = (0, import_react7.useState)(false);
  const loggedIn = auth?.configured === true;
  const stale = loggedIn && auth?.stale === true;
  const label = !loggedIn ? "\u672A\u767B\u5F55 \xB7 \u767B\u5F55" : stale ? "\u767B\u5F55\u5DF2\u5931\u6548 \xB7 \u91CD\u65B0\u767B\u5F55" : auth?.nickname || auth?.uid || "\u5DF2\u767B\u5F55";
  if (auth == null) return /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-accountChip is-loading", "aria-hidden": "true" }, "\u2026");
  if (!loggedIn || stale) {
    return /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        type: "button",
        className: `wbh-accountChip${stale ? " is-stale" : ""}`,
        "aria-label": stale ? "WorkBuddy \u767B\u5F55\u5DF2\u5931\u6548\uFF0C\u91CD\u65B0\u767B\u5F55" : "\u767B\u5F55 WorkBuddy \u8D26\u53F7",
        title: stale ? auth?.lastError || STALE_LOGIN_REASON : void 0,
        onClick: onLogin
      },
      /* @__PURE__ */ import_react7.default.createElement("i", { className: "wbh-dot off" }),
      label
    );
  }
  return /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-accountWrap" }, /* @__PURE__ */ import_react7.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-accountChip is-on",
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: () => setOpen((v) => !v)
    },
    /* @__PURE__ */ import_react7.default.createElement("i", { className: "wbh-dot" }),
    label
  ), open && /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-addScrim", onClick: () => setOpen(false) }), /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-accountPop", role: "menu" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-accountRow" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-muted" }, "\u6635\u79F0"), /* @__PURE__ */ import_react7.default.createElement("span", null, auth?.nickname || "\u2014")), /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-accountRow" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-muted" }, "uid"), /* @__PURE__ */ import_react7.default.createElement("span", null, auth?.uid || "\u2014")), auth?.expiresAt ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-accountRow" }, /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-muted" }, "\u6388\u6743\u5230\u671F"), /* @__PURE__ */ import_react7.default.createElement("span", null, new Date(auth.expiresAt).toLocaleString("zh-CN"))) : null, /* @__PURE__ */ import_react7.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-accountLogout",
      onClick: async () => {
        setOpen(false);
        await hub.authLogout();
        await refreshAuth();
      }
    },
    "\u6CE8\u9500"
  ))));
}
function MarketPage({ sessionId, workspaceId, runCommand: runCommand2 }) {
  const [kind, setKind] = (0, import_react7.useState)("expert");
  const [query, setQuery] = (0, import_react7.useState)("");
  const [installed, setInstalled] = (0, import_react7.useState)({});
  const [mounted, setMounted] = (0, import_react7.useState)(/* @__PURE__ */ new Set());
  const [busy, setBusy] = (0, import_react7.useState)("");
  const [notice, setNotice] = (0, import_react7.useState)("");
  const [summoning, setSummoning] = (0, import_react7.useState)(null);
  const [authorising, setAuthorising] = (0, import_react7.useState)(null);
  const [auth, setAuth] = (0, import_react7.useState)(() => authState());
  const [showAuth, setShowAuth] = (0, import_react7.useState)(false);
  const refresh = (0, import_react7.useCallback)(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)]);
      setInstalled(inst);
      setMounted(new Set(mnt));
    } catch {
    }
    await refreshAuth();
  }, [sessionId]);
  (0, import_react7.useEffect)(() => {
    void refresh();
  }, [refresh]);
  (0, import_react7.useEffect)(() => onAuthChange(setAuth), []);
  (0, import_react7.useEffect)(() => onAuthRequired(() => {
    if (claimAuthGate("page")) setShowAuth(true);
  }), []);
  const attach = (0, import_react7.useCallback)(async (entry, task = "") => {
    const key = `${entry.kind}/${entry.name}`;
    if (entry.kind === "connector" && entry.desktop && entry.desktop.supported === false) {
      setNotice(`\u300C${entry.displayName}\u300D\u4E0D\u53EF\u81EA\u52A8\u63A5\u5165\uFF1A${entry.desktop.unsupportedReason || "\u8BE5\u8FDE\u63A5\u5668\u7C7B\u578B\u4E0D\u53D7\u652F\u6301"}`);
      return;
    }
    setBusy(key);
    setNotice("");
    addSelection(entry, sessionId);
    try {
      const installSource = entry.source === "desktop" ? "desktop" : entry.official ? "official" : void 0;
      if (!installed[key]) await hub.install(entry.kind, entry.name, installSource);
      if (entry.kind === "connector") {
        if (installed[key]?.enabled) {
          await hub.disableConnector(entry.name);
          if (sessionId) await hub.unmount(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u65AD\u5F00\u300C${entry.displayName}\u300D`);
        } else {
          const r = await hub.enableConnector(entry.name);
          await hub.mount(sessionId, entry.kind, entry.name);
          addSelection(entry, sessionId);
          setNotice(`\u5DF2\u8FDE\u63A5\u300C${entry.displayName}\u300D\uFF08\u5DE5\u5177\u547D\u540D\u7A7A\u95F4 ${r.serverName}\uFF09\uFF0C\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528\u3002`);
        }
      } else if (entry.kind === "expert") {
        const r = await summonExpertInNewSession(entry);
        setNotice(summonNotice(r, entry.displayName));
      } else {
        await hub.mount(sessionId, entry.kind, entry.name);
        addSelection(entry, sessionId);
        setNotice(`\u5DF2\u6302\u8F7D\u300C${entry.displayName}\u300D`);
      }
      await refresh();
    } catch (error) {
      const refs = error.body?.credentialRefs ?? [];
      if (refs.length > 0) setAuthorising({ entry, refs, error: error.message });
      else setNotice(`\u5931\u8D25\uFF1A${error.message}`);
    } finally {
      setBusy("");
    }
  }, [installed, refresh, runCommand2, sessionId]);
  const onDetail = (0, import_react7.useCallback)((entry) => {
    if (entry.kind === "expert") setSummoning(entry);
    else void attach(entry);
  }, [attach]);
  const onAction = (0, import_react7.useCallback)((entry) => {
    if (entry.kind === "expert") {
      setBusy(`${entry.kind}/${entry.name}`);
      setNotice("");
      void summonExpertInNewSession(entry).then((r) => {
        setNotice(summonNotice(r, entry.displayName));
      }).catch((error) => {
        setNotice(`\u5931\u8D25\uFF1A${String(error?.message || error)}`);
      }).finally(() => setBusy(""));
    } else void attach(entry);
  }, [attach, workspaceId]);
  const summonNotice = (r, displayName) => r?.ok ? r.replaced ? `\u5DF2\u6539\u4E3A\u9009\u62E9\u300C${displayName}\u300D\uFF08\u66FF\u6362\u4E86\u4E0A\u4E00\u6B21\u9009\u62E9\u7684\u4E13\u5BB6\uFF09\uFF1A\u65B0\u4F1A\u8BDD\u91CC\u4F1A\u81EA\u52A8\u52A0\u8F7D` : `\u5DF2\u9009\u62E9\u300C${displayName}\u300D\uFF1A\u65B0\u4F1A\u8BDD\u91CC\u4F1A\u81EA\u52A8\u52A0\u8F7D\u8BE5\u4E13\u5BB6\uFF08\u53EF\u81EA\u884C\u9009\u62E9\u5DE5\u4F5C\u533A\uFF09` : `\u5931\u8D25\uFF1A${r?.error || "\u672A\u77E5\u9519\u8BEF"}`;
  const loggedIn = auth?.configured === true;
  return /* @__PURE__ */ import_react7.default.createElement("div", { className: "expert-center-page wbh-page", "data-wbh-session": sessionId || "" }, /* @__PURE__ */ import_react7.default.createElement(
    Catalogue,
    {
      sessionId,
      kind,
      onKind: setKind,
      query,
      onQuery: setQuery,
      onDetail,
      onAction,
      installed,
      mounted,
      busy,
      onRefresh: refresh,
      topbarRight: /* @__PURE__ */ import_react7.default.createElement(AccountCapsule, { auth, onLogin: () => setShowAuth(true) })
    }
  ), notice && /* @__PURE__ */ import_react7.default.createElement("p", { className: "wbh-notice" }, notice), summoning && /* @__PURE__ */ import_react7.default.createElement(
    SummonModal,
    {
      entry: summoning,
      busy: busy === `${summoning.kind}/${summoning.name}`,
      onClose: () => setSummoning(null),
      onConfirm: async () => {
        const picked = summoning;
        setSummoning(null);
        void onAction(picked);
      },
      onQuickPrompt: (text) => {
        const picked = summoning;
        setSummoning(null);
        void summonExpertInNewSession(picked).then((r) => {
          setNotice(summonNotice(r, picked.displayName));
          if (r.ok) setTimeout(() => {
            try {
              insertPromptIntoComposer(text);
            } catch {
            }
          }, 900);
        }).catch((error) => {
          setNotice(`\u5931\u8D25\uFF1A${String(error?.message || error)}`);
        });
      }
    }
  ), authorising && /* @__PURE__ */ import_react7.default.createElement(
    ConnectorAuthModal,
    {
      entry: authorising.entry,
      refs: authorising.refs,
      error: authorising.error,
      busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
      onClose: () => setAuthorising(null),
      onRetry: async () => {
        await attach(authorising.entry);
        setAuthorising(null);
      }
    }
  ), showAuth && /* @__PURE__ */ import_react7.default.createElement(
    WbAuthCard,
    {
      variant: "modal",
      reason: authStale(auth) ? STALE_LOGIN_REASON : "",
      onClose: () => {
        setShowAuth(false);
        settleAuthGate(false);
        void refresh();
      },
      onDone: () => {
        void refresh();
      }
    }
  ));
}

// src/ComposerAdd.jsx
var import_react10 = __toESM(require("react"), 1);

// src/AttachedRail.jsx
var import_react8 = __toESM(require("react"), 1);
function RailConnectorIcon({ icon, name }) {
  const [broken, setBroken] = (0, import_react8.useState)(false);
  if (!icon || broken) return /* @__PURE__ */ import_react8.default.createElement(WbIcon, { name: "link", size: 13 });
  return /* @__PURE__ */ import_react8.default.createElement(
    "img",
    {
      src: icon,
      alt: name,
      title: name,
      "aria-label": name,
      onError: () => setBroken(true),
      className: "wbh-chipLogoImg"
    }
  );
}
function AttachedRail({ sessionId }) {
  const [items, setItems] = (0, import_react8.useState)(selectedItems(sessionId));
  const [busy, setBusy] = (0, import_react8.useState)("");
  const sync = (0, import_react8.useCallback)(() => setItems([...selectedItems(sessionId)]), [sessionId]);
  (0, import_react8.useEffect)(() => onSelectionChange(sync), [sync]);
  (0, import_react8.useEffect)(() => onCatalogChange(sync), [sync]);
  const detach = async (item) => {
    setBusy(item.key);
    removeSelection(sessionId, item.kind, item.name);
    if (item.kind === "expert") clearPendingExpert();
    try {
      if (item.kind === "connector") await hub.disableConnector(item.name);
      if (sessionId) await hub.unmount(sessionId, item.kind, item.name);
    } catch {
    } finally {
      setBusy("");
    }
  };
  if (items.length === 0) return null;
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "wbh-rail", "data-rail-count": items.length, "data-session": sessionId || "none" }, items.map((item) => (
    /* 结构对齐官方 chat 端 chip（.cr-chip-base）：[关闭][logo][名称]，
       容器 32 高 / 圆角 8 / 透明底 + hover 底色，具体数值见 app.css。 */
    /* @__PURE__ */ import_react8.default.createElement(
      "span",
      {
        key: item.key,
        className: "wbh-railChip",
        "data-kind": item.kind,
        title: `${item.kind}\uFF1A${item.displayName}`
      },
      /* @__PURE__ */ import_react8.default.createElement(
        "button",
        {
          type: "button",
          className: "wbh-chipClose",
          disabled: busy === item.key,
          "aria-label": `\u79FB\u9664 ${item.displayName}`,
          onClick: () => void detach(item)
        },
        /* @__PURE__ */ import_react8.default.createElement(WbIcon, { name: "close", size: 14 })
      ),
      /* @__PURE__ */ import_react8.default.createElement("span", { className: `wbh-chipLogo${item.kind === "connector" ? " is-connector" : ""}` }, item.kind === "connector" ? /* @__PURE__ */ import_react8.default.createElement(RailConnectorIcon, { icon: item.icon, name: item.displayName }) : item.icon ? /* @__PURE__ */ import_react8.default.createElement("img", { src: item.icon, alt: "", onError: (e) => {
        e.currentTarget.style.display = "none";
      } }) : /* @__PURE__ */ import_react8.default.createElement(WbIcon, { name: item.kind === "expert" ? "person" : "sparkle", size: 13 })),
      /* @__PURE__ */ import_react8.default.createElement("span", { className: "wbh-chipLabel" }, item.displayName)
    )
  )));
}

// src/ExpertMarketModal.jsx
var import_react9 = __toESM(require("react"), 1);
var TITLES = {
  expert: { title: "\u66F4\u591A\u4E13\u5BB6", hint: "\u9009\u4E2D\u5373\u52A0\u8F7D\u5230\u5F53\u524D\u5BF9\u8BDD" },
  skill: { title: "\u66F4\u591A\u6280\u80FD", hint: "\u9009\u4E2D\u5373\u52A0\u8F7D\u5230\u5F53\u524D\u5BF9\u8BDD" },
  connector: { title: "\u8FDE\u63A5\u5668\u5E02\u573A", hint: "\u9009\u4E2D\u5373\u8FDE\u63A5\u5E76\u6302\u5230\u5F53\u524D\u5BF9\u8BDD" }
};
function ExpertMarketModal({
  sessionId,
  kind: initialKind = "expert",
  installed = {},
  mounted = /* @__PURE__ */ new Set(),
  busy = "",
  notice = "",
  onAction,
  onClose,
  onRefresh
}) {
  const [kind, setKind] = (0, import_react9.useState)(initialKind);
  const [query, setQuery] = (0, import_react9.useState)("");
  const meta = TITLES[kind] || TITLES.expert;
  return /* @__PURE__ */ import_react9.default.createElement(
    "div",
    {
      className: "ec-modal-overlay wbh-marketOverlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": meta.title,
      onClick: (event) => {
        if (event.target === event.currentTarget) onClose?.();
      }
    },
    /* @__PURE__ */ import_react9.default.createElement("div", { className: "ec-modal-card wbh-marketModal", "data-wbh-market-kind": kind }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-marketModalHead" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-marketModalTitle" }, meta.title), /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-marketModalHint" }, meta.hint), /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", className: "ec-modal-close wbh-marketModalClose", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ import_react9.default.createElement(WbIcon, { name: "close", size: 14 }))), notice ? /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-marketModalNotice" }, notice) : null, /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-marketModalBody" }, /* @__PURE__ */ import_react9.default.createElement(
      Catalogue,
      {
        variant: "page",
        sessionId,
        kind,
        onKind: setKind,
        query,
        onQuery: setQuery,
        installed,
        mounted,
        busy,
        onAction,
        onDetail: onAction,
        onRefresh
      }
    )))
  );
}

// src/ComposerAdd.jsx
var PANEL_WIDTH = { expert: 200, skill: 320, connector: 240 };
async function mountForSession(sessionId, kind, name) {
  if (!sessionId) return;
  const key = `${kind}/${name}`;
  markMountPending(sessionId, key);
  try {
    await hub.mount(sessionId, kind, name);
  } finally {
    clearMountPending(sessionId, key);
  }
}
var KINDS2 = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "menuExpert" },
  { id: "skill", label: "\u6280\u80FD", icon: "menuSkill" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "menuConnector" }
];
function ComposerAdd({ sessionId, runCommand: runCommand2, sessionBlank }) {
  const [menuOpen, setMenuOpen] = (0, import_react10.useState)(false);
  const [pickerOpen, setPickerOpen] = (0, import_react10.useState)(false);
  const [kind, setKind] = (0, import_react10.useState)("expert");
  const [query, setQuery] = (0, import_react10.useState)("");
  const [installed, setInstalled] = (0, import_react10.useState)({});
  const [mounted, setMounted] = (0, import_react10.useState)(/* @__PURE__ */ new Set());
  const [busy, setBusy] = (0, import_react10.useState)("");
  const [notice, setNotice] = (0, import_react10.useState)("");
  const [summoning, setSummoning] = (0, import_react10.useState)(null);
  const [marketOpen, setMarketOpen] = (0, import_react10.useState)(false);
  const [authorising, setAuthorising] = (0, import_react10.useState)(null);
  const [recent, setRecent] = (0, import_react10.useState)([]);
  const [auth, setAuth] = (0, import_react10.useState)(() => authState());
  const [showAuth, setShowAuth] = (0, import_react10.useState)(false);
  const [geom, setGeom] = (0, import_react10.useState)({ top: 8, maxH: 0, maxW: 0, shift: 0 });
  const [settled, setSettled] = (0, import_react10.useState)(false);
  (0, import_react10.useEffect)(() => {
    if (pickerOpen) setSettled(false);
  }, [pickerOpen, kind]);
  const anchor = (0, import_react10.useRef)(null);
  const itemRefs = (0, import_react10.useRef)({});
  const wrapRef = (0, import_react10.useRef)(null);
  const layerRef = (0, import_react10.useRef)(null);
  const refresh = (0, import_react10.useCallback)(async () => {
    const token = beginReconcile(sessionId);
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)]);
      if (!isCurrentReconcile(sessionId, token)) return;
      setInstalled(inst);
      setMounted(new Set(mnt));
      reconcileSelections(sessionId, mnt, inst);
    } catch {
    }
  }, [sessionId]);
  (0, import_react10.useEffect)(() => {
    setComposerSession(sessionId);
  }, [sessionId]);
  (0, import_react10.useEffect)(() => {
    if (!sessionId) return;
    const pending = peekPendingExpert();
    if (!pending) return;
    if (sessionBlank === false) {
      clearPendingExpert();
      return;
    }
    addSelection(pending, sessionId);
    void mountForSession(sessionId, "expert", pending.name).then(() => console.info("[wbh] pending expert applied:", pending.name, "-> session", sessionId)).catch((error) => console.warn("[wbh] pending expert mount failed:", String(error?.message || error)));
  }, [sessionId, sessionBlank]);
  (0, import_react10.useEffect)(() => {
    void refresh();
  }, [refresh]);
  (0, import_react10.useEffect)(() => onCatalogChange(refresh), [refresh]);
  (0, import_react10.useEffect)(() => {
    if (authState() === null) void refreshAuth();
    return onAuthChange(setAuth);
  }, []);
  (0, import_react10.useEffect)(() => onAuthRequired(() => {
    if (claimAuthGate("picker")) setShowAuth(true);
  }), []);
  (0, import_react10.useEffect)(() => {
    if (!menuOpen && !pickerOpen) return void 0;
    const onDown = (event) => {
      if (anchor.current && !anchor.current.contains(event.target)) {
        setMenuOpen(false);
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen, pickerOpen]);
  (0, import_react10.useEffect)(() => onMarketRequest(() => {
    setMenuOpen(false);
    setPickerOpen(false);
  }), []);
  const openPicker = (0, import_react10.useCallback)((k) => {
    setKind(k);
    setQuery("");
    const row = itemRefs.current[k];
    if (row) setGeom((prev) => ({ ...prev, top: row.offsetTop }));
    setMenuOpen(true);
    setPickerOpen(true);
  }, []);
  (0, import_react10.useLayoutEffect)(() => {
    if (!pickerOpen) return void 0;
    const MARGIN = 8;
    const shift = geom.shift;
    const compute = () => {
      const wrapEl2 = wrapRef.current;
      const menuEl = anchor.current ? anchor.current.querySelector(".wbh-menu") : null;
      const rowEl = itemRefs.current[kind];
      if (!wrapEl2 || !menuEl || !rowEl) return;
      const vw = window.innerWidth || document.documentElement.clientWidth || 0;
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (!vw || !vh) return;
      const menuRect = menuEl.getBoundingClientRect();
      const menuTop = menuRect.top;
      const limit = vw - MARGIN;
      const naturalW = PANEL_WIDTH[kind] || 240;
      const unshiftedMenuLeft = menuRect.left + shift;
      const desiredWrapLeft = unshiftedMenuLeft + 194;
      const overflow = desiredWrapLeft + naturalW - limit;
      const nextShift = overflow > 0 ? Math.max(0, Math.round(Math.min(overflow, Math.max(0, unshiftedMenuLeft - MARGIN)))) : 0;
      const wrapLeft = desiredWrapLeft - nextShift;
      const maxH = Math.max(140, Math.round(vh - MARGIN * 2));
      const maxW = Math.max(140, Math.round(limit - wrapLeft));
      const h2 = Math.min(wrapEl2.offsetHeight || 0, maxH);
      let top = rowEl.offsetTop;
      if (menuTop + top + h2 > vh - MARGIN) top = vh - MARGIN - h2 - menuTop;
      if (menuTop + top < MARGIN) top = MARGIN - menuTop;
      top = Math.round(top);
      setGeom((prev) => prev.top === top && prev.maxH === maxH && prev.maxW === maxW && prev.shift === nextShift ? prev : { top, maxH, maxW, shift: nextShift });
    };
    compute();
    let observer = null;
    const wrapEl = wrapRef.current;
    if (wrapEl && typeof ResizeObserver === "function") {
      observer = new ResizeObserver(compute);
      observer.observe(wrapEl);
    }
    window.addEventListener("resize", compute);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [pickerOpen, kind, geom.maxH, geom.shift, settled]);
  const attach = (0, import_react10.useCallback)(async (entry, task = "") => {
    const key = `${entry.kind}/${entry.name}`;
    setBusy(key);
    setNotice("");
    let installSource = "";
    const replacedOnAdd = addSelection(entry, sessionId);
    try {
      let already = Boolean(installed[key]);
      if (!already) {
        try {
          const fresh = await hub.installed();
          already = Boolean(fresh[key]);
        } catch {
        }
      }
      if (!already) {
        try {
          const ins = await hub.install(entry.kind, entry.name, entry.official ? "official" : void 0);
          installSource = ins?.source || "";
        } catch (error) {
          const fresh = await hub.installed().catch(() => ({}));
          if (!fresh[key]) throw error;
        }
      }
      if (entry.kind === "connector") {
        if (!installed[key]?.enabled) await hub.enableConnector(entry.name);
        await mountForSession(sessionId, entry.kind, entry.name);
        setNotice(`\u5DF2\u8FDE\u63A5\u300C${entry.displayName}\u300D\uFF0C\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u5728\u5BF9\u8BDD\u4E2D\u4F7F\u7528\u3002`);
      } else if (entry.kind === "expert") {
        await mountForSession(sessionId, entry.kind, entry.name);
        markExpertRecent(entry);
        const mirrorNote = installSource === "mirror" ? "\uFF08\u5B98\u65B9\u7F3A\u8BE5\u4E13\u5BB6\u6587\u4EF6\uFF0C\u672C\u6B21\u7528\u955C\u50CF\u526F\u672C\u5B89\u88C5\uFF09" : "";
        setNotice((replacedOnAdd.length ? `\u5DF2\u66FF\u6362\u300C${replacedOnAdd[0].displayName}\u300D\u2192\u300C${entry.displayName}\u300D\uFF0C\u4E0B\u4E00\u6B65\u8D77\u4EE5\u8BE5\u4E13\u5BB6\u8EAB\u4EFD\u56DE\u7B54` : `\u5DF2\u9009\u4E2D\u300C${entry.displayName}\u300D\uFF0C\u4E0B\u4E00\u6B65\u8D77\u4EE5\u8BE5\u4E13\u5BB6\u8EAB\u4EFD\u56DE\u7B54`) + mirrorNote);
      } else {
        await mountForSession(sessionId, entry.kind, entry.name);
        setNotice(`\u5DF2\u6302\u8F7D\u300C${entry.displayName}\u300D`);
      }
      setRecent((prev) => [entry, ...prev.filter((e) => e.key !== key)].slice(0, 5));
      await refresh();
      return true;
    } catch (error) {
      if (!mounted.has(key)) {
        removeSelection(sessionId, entry.kind, entry.name);
        if (replacedOnAdd.length) addSelection(replacedOnAdd[0], sessionId);
      }
      const refs = error.body?.credentialRefs ?? [];
      if (refs.length > 0) setAuthorising({ entry, refs, error: error.message });
      else setNotice(`\u5931\u8D25\uFF1A${error.message}`);
      return false;
    } finally {
      setBusy("");
    }
  }, [installed, mounted, refresh, runCommand2, sessionId]);
  const onDetail = (0, import_react10.useCallback)((entry) => {
    if (entry.kind === "expert") {
      setSummoning(entry);
      setPickerOpen(false);
    } else void attach(entry);
  }, [attach]);
  const onAction = (0, import_react10.useCallback)((entry) => {
    void attach(entry);
  }, [attach]);
  const menuEntries = (0, import_react10.useMemo)(() => {
    const pool = [];
    for (const key of mounted) {
      const [k, name] = key.split("/");
      const rec = installed[key];
      if (rec) pool.push({ kind: k, name, displayName: rec.displayName || name, icon: rec.icon || "", key });
    }
    for (const [key, rec] of Object.entries(installed)) {
      if (pool.length >= 6) break;
      if (pool.some((p) => p.key === key)) continue;
      const [k, name] = key.split("/");
      pool.push({ kind: k, name, displayName: rec.displayName || name, icon: rec.icon || "", key });
    }
    return pool;
  }, [installed, mounted]);
  const authStaleNow = auth?.configured === true && auth?.stale === true;
  const authFooter = auth == null || auth.configured === true && !authStaleNow ? null : /* @__PURE__ */ import_react10.default.createElement(
    "div",
    {
      className: "wbh-flyoutFooterItem wbh-flyoutLogin",
      role: "menuitem",
      tabIndex: 0,
      onClick: (e) => {
        e.stopPropagation();
        setShowAuth(true);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") setShowAuth(true);
      }
    },
    /* @__PURE__ */ import_react10.default.createElement("span", { className: "wbh-flyoutFooterIcon" }, /* @__PURE__ */ import_react10.default.createElement(PickIcon, { name: "tabExpert", size: 16 })),
    /* @__PURE__ */ import_react10.default.createElement("span", { className: "wbh-flyoutFooterLabel" }, authStaleNow ? "\u767B\u5F55\u5DF2\u5931\u6548 \xB7 \u91CD\u65B0\u626B\u7801" : "\u672A\u767B\u5F55 \xB7 \u767B\u5F55\u540E\u53EF\u52A0\u8F7D\u5B98\u65B9\u76EE\u5F55")
  );
  return /* @__PURE__ */ import_react10.default.createElement("div", { className: "wbh-anchor wbh-port", ref: anchor }, /* @__PURE__ */ import_react10.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-plus",
      "aria-label": "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668",
      "aria-expanded": menuOpen || pickerOpen || void 0,
      title: "\u4E13\u5BB6 \xB7 \u6280\u80FD \xB7 \u8FDE\u63A5\u5668",
      "data-wbh-session": sessionId || "",
      onClick: () => {
        setMenuOpen((v) => !v);
        setPickerOpen(false);
      }
    },
    /* @__PURE__ */ import_react10.default.createElement(WbIcon, { name: "plus", size: 14 })
  ), /* @__PURE__ */ import_react10.default.createElement(AttachedRail, { sessionId }), menuOpen && /* @__PURE__ */ import_react10.default.createElement(import_react10.default.Fragment, null, /* @__PURE__ */ import_react10.default.createElement("div", { className: "wbh-popScrim", onClick: () => {
    setMenuOpen(false);
    setPickerOpen(false);
  } }), /* @__PURE__ */ import_react10.default.createElement(
    "div",
    {
      className: "wbh-pickerLayer",
      ref: layerRef,
      style: geom.shift ? { transform: `translateX(-${geom.shift}px)` } : void 0
    },
    /* @__PURE__ */ import_react10.default.createElement("div", { className: "wbh-menu", role: "menu" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "wbh-menu-group" }, KINDS2.map((k) => /* @__PURE__ */ import_react10.default.createElement(
      "div",
      {
        key: k.id,
        className: `wbh-menu-item${pickerOpen && kind === k.id ? " is-open" : ""}`,
        role: "menuitem",
        tabIndex: 0,
        ref: (el) => {
          itemRefs.current[k.id] = el;
        },
        onMouseEnter: () => openPicker(k.id),
        onClick: () => openPicker(k.id),
        onKeyDown: (e) => {
          if (e.key === "Enter") openPicker(k.id);
        }
      },
      /* @__PURE__ */ import_react10.default.createElement("span", { className: "wbh-menu-icon" }, /* @__PURE__ */ import_react10.default.createElement(PickIcon, { name: k.icon, size: 16 })),
      /* @__PURE__ */ import_react10.default.createElement("span", { className: "wbh-menu-name" }, k.label),
      /* @__PURE__ */ import_react10.default.createElement("span", { className: "wbh-menu-chevron", "aria-hidden": "true" }, /* @__PURE__ */ import_react10.default.createElement(PickIcon, { name: "menuChevron", size: 14 }))
    ))), pickerOpen && /* @__PURE__ */ import_react10.default.createElement(
      "div",
      {
        className: "wbh-flyoutWrap",
        ref: wrapRef,
        style: {
          top: `${geom.top}px`,
          "--wbh-maxh": geom.maxH ? `${geom.maxH}px` : "none",
          "--wbh-maxw": geom.maxW ? `${geom.maxW}px` : "none",
          // 行加载完（settled）之前先隐形占位：仍参与布局所以量得到尺寸，几何一次算准，
          // 面板不会在用户点行的时候跳位。
          visibility: settled ? void 0 : "hidden"
        }
      },
      /* @__PURE__ */ import_react10.default.createElement(
        Catalogue,
        {
          variant: "picker",
          sessionId,
          kind,
          onKind: setKind,
          query,
          onQuery: setQuery,
          onDetail,
          onAction,
          installed,
          mounted,
          busy,
          footerExtra: authFooter,
          onMore: () => {
            setMenuOpen(false);
            setPickerOpen(false);
            setMarketOpen(true);
          },
          onSettled: () => setSettled(true)
        }
      )
    ))
  ), notice && /* @__PURE__ */ import_react10.default.createElement("div", { className: "wbh-flyoutNotice" }, notice)), marketOpen && /* 「召唤更多专家」小窗口：内容 = 市场页目录；这里的动作**直接作用于当前对话**
     （attach 已经包含：没装先装 → 挂到 sessionId → 出 chip），成功后关窗露出 chip。 */
  /* @__PURE__ */ import_react10.default.createElement(
    ExpertMarketModal,
    {
      sessionId,
      kind: "expert",
      installed,
      mounted,
      busy,
      notice,
      onRefresh: refresh,
      onClose: () => setMarketOpen(false),
      onAction: async (entry) => {
        const ok = await attach(entry);
        if (ok) setMarketOpen(false);
      }
    }
  ), summoning && /* @__PURE__ */ import_react10.default.createElement(
    SummonModal,
    {
      entry: summoning,
      busy: busy === `${summoning.kind}/${summoning.name}`,
      onClose: () => setSummoning(null),
      onConfirm: async (task) => {
        await attach(summoning, task);
        setSummoning(null);
      },
      onQuickPrompt: (text) => {
        setSummoning(null);
        void attach(summoning, text);
        insertPromptIntoComposer(text);
      }
    }
  ), authorising && /* @__PURE__ */ import_react10.default.createElement(
    ConnectorAuthModal,
    {
      entry: authorising.entry,
      refs: authorising.refs,
      error: authorising.error,
      busy: busy === `${authorising.entry.kind}/${authorising.entry.name}`,
      onClose: () => setAuthorising(null),
      onRetry: async () => {
        await attach(authorising.entry);
        setAuthorising(null);
      }
    }
  ), showAuth && /* @__PURE__ */ import_react10.default.createElement(
    WbAuthCard,
    {
      variant: "modal",
      reason: authStaleNow ? STALE_LOGIN_REASON : "",
      onClose: () => {
        setShowAuth(false);
        settleAuthGate(false);
        void refreshAuth();
      },
      onDone: () => {
        void refresh();
      }
    }
  ));
}

// src/SettingsPage.jsx
var import_react11 = __toESM(require("react"), 1);
function uninstallNotice(kind, label, result) {
  if (!result || result.ok !== true) {
    const reason = String(result?.error || result?.message || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0");
    const status = result?.status ? `\uFF08HTTP ${result.status}\uFF09` : "";
    return { ok: false, text: `\u79FB\u9664\u300C${label}\u300D\u5931\u8D25\uFF1A${reason}${status}` };
  }
  if (kind === "connector") return { ok: true, text: `\u5DF2\u79FB\u9664\u8FDE\u63A5\u5668\u300C${label}\u300D\uFF08\u5DF2\u5148\u505C\u7528\u518D\u5220\u9664\uFF09` };
  if (kind === "expert") return { ok: true, text: `\u5DF2\u79FB\u9664\u4E13\u5BB6\u300C${label}\u300D\uFF0C\u5E76\u5DF2\u4ECE\u4F1A\u8BDD\u4E2D\u79FB\u9664\u6302\u8F7D` };
  return { ok: true, text: `\u5DF2\u79FB\u9664\u6280\u80FD\u300C${label}\u300D` };
}
function removeHint(kind) {
  if (kind === "connector") return "\u5148\u505C\u7528\u518D\u5220\u9664";
  if (kind === "expert") return "\u5E76\u4ECE\u4F1A\u8BDD\u4E2D\u79FB\u9664";
  return "\u5E76\u89E3\u9664\u6280\u80FD\u94FE\u63A5";
}
var KIND_LABEL = { expert: "\u4E13\u5BB6", skill: "\u6280\u80FD", connector: "\u8FDE\u63A5\u5668" };
function humanBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
function downloadSize(entry) {
  const remote = Number(entry?.remoteBytes ?? entry?.status?.remoteBytes);
  if (Number.isFinite(remote) && remote > 0) return { bytes: remote, approximate: false };
  return { bytes: Number(entry?.bytes ?? entry?.status?.bytes) || 0, approximate: true };
}
function updatesSizeLabel(entries) {
  let total = 0;
  let approximate = false;
  for (const entry of entries ?? []) {
    const size = downloadSize(entry);
    total += size.bytes;
    if (size.approximate) approximate = true;
  }
  return `${approximate ? "\u7EA6 " : ""}${humanBytes(total)}`;
}
function updateFailureReason(error) {
  const message = String(error?.message || error || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0");
  const status = Number(error?.status) || 0;
  const withStatus = status ? `\uFF08HTTP ${status}\uFF09` : "";
  if (/\b(403|429)\b|rate limit|api rate/i.test(message)) return `\u63A5\u53E3\u9650\u6D41\uFF1A${message}${withStatus}`;
  if (/fetch failed|ENOTFOUND|ETIMEDOUT|ECONNRESET|EAI_AGAIN|socket hang up|network|请求超时/i.test(message)) {
    return `\u7F51\u7EDC\u4E0D\u53EF\u8FBE\uFF1A${message}${withStatus}`;
  }
  return `\u5B89\u88C5\u5931\u8D25\uFF1A${message}${withStatus}`;
}
function updateNotice(kind, label, result) {
  const what = KIND_LABEL[kind] || "\u6761\u76EE";
  if (!result || result.ok !== true) {
    return { ok: false, text: `\u66F4\u65B0${what}\u300C${label}\u300D\u5931\u8D25\uFF1A${updateFailureReason(result)}` };
  }
  return { ok: true, text: `\u5DF2\u66F4\u65B0${what}\u300C${label}\u300D` };
}
function checkFailureText(result) {
  return `\u68C0\u67E5\u5931\u8D25\uFF1A${String(result?.error || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0")}\uFF08\u672C\u6B21\u7ED3\u679C\u4E0D\u53EF\u7528\uFF0C\u6240\u6709\u6761\u76EE\u663E\u793A\u300C\u65E0\u6CD5\u68C0\u67E5\u300D\uFF09`;
}
function checkSummaryText(result, checking) {
  if (checking) return "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026";
  if (!result) return "\u5C1A\u672A\u68C0\u67E5\u66F4\u65B0";
  if (result.ok === false) return checkFailureText(result);
  const counts = result.counts ?? {};
  const at = result.checkedAt ? new Date(result.checkedAt).toLocaleTimeString("zh-CN") : "";
  const cached = result.cached ? "\uFF08\u7F13\u5B58\uFF09" : "";
  return `\u68C0\u67E5\u4E8E ${at}${cached} \xB7 \u6709\u66F4\u65B0 ${counts.update ?? 0} \xB7 \u5DF2\u662F\u6700\u65B0 ${counts.current ?? 0} \xB7 \u65E0\u6CD5\u68C0\u67E5 ${counts.unknown ?? 0}`;
}
function localMcpBadge(server) {
  if (server?.enabled) return { className: "wbh-badge wbh-badgeCurrent", text: "\u5DF2\u542F\u7528" };
  if (String(server?.lastError || "")) return { className: "wbh-badge wbh-badgeUnknown", text: `\u8FDE\u4E0D\u4E0A\uFF1A${server.lastError}` };
  return { className: "wbh-badge wbh-badgeIdle", text: "\u5DF2\u505C\u7528" };
}
function localMcpToolCount(server) {
  const n = Number(server?.toolCount);
  return Number.isFinite(n) && n >= 0 ? String(n) : "\u2014";
}
function validateLocalMcpForm(name, url, token) {
  if (!/^[\w.-]+$/.test(String(name || ""))) return "\u540D\u79F0\u53EA\u5141\u8BB8\u5B57\u6BCD\u6570\u5B57\u3001\u70B9\u3001\u4E0B\u5212\u7EBF\u3001\u8FDE\u5B57\u7B26";
  if (String(name || "").length > 80) return "\u540D\u79F0\u8FC7\u957F\uFF08\u226480\uFF09";
  const trimmedUrl = String(url || "").trim();
  if (!/^https?:\/\//i.test(trimmedUrl)) return "URL \u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934";
  let host = "";
  try {
    host = new URL(trimmedUrl).hostname.toLowerCase();
  } catch {
    return "URL \u65E0\u6CD5\u89E3\u6790";
  }
  const isLoopback = host === "localhost" || host === "::1" || /^127(\.\d{1,3}){3}$/.test(host.replace(/^\[|\]$/g, ""));
  if (!isLoopback) return "\u53EA\u5141\u8BB8\u672C\u673A\u5730\u5740\uFF08127.0.0.1 / localhost / ::1\uFF09\u2014\u2014 \u975E\u672C\u673A MCP \u4E00\u5F8B\u4E0D\u6536";
  if (String(token || "").length > 4096) return "token \u8FC7\u957F\uFF08\u22644096\uFF09";
  return "";
}
function localMcpSaveNotice(result) {
  if (!result || result.ok !== true) {
    return { ok: false, text: `\u6CE8\u518C\u5931\u8D25\uFF1A${String(result?.error || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0")}` };
  }
  return { ok: true, text: `\u5DF2\u6CE8\u518C\u672C\u5730 MCP\u300C${result.server?.name}\u300D\uFF08\u5DE5\u5177\u547D\u540D\u7A7A\u95F4 mcp__${result.server?.serverName}__\uFF09` };
}
function localMcpActionNotice(action, name, result) {
  const what = { enable: "\u542F\u7528", disable: "\u505C\u7528", remove: "\u79FB\u9664" }[action] || action;
  if (!result || result.ok !== true) {
    return { ok: false, text: `${what}\u300C${name}\u300D\u5931\u8D25\uFF1A${String(result?.error || "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u539F\u56E0")}` };
  }
  if (action === "enable") return { ok: true, text: `\u5DF2\u542F\u7528\u300C${name}\u300D\uFF08\u547D\u540D\u7A7A\u95F4 mcp__${result.server?.serverName || name}__\uFF09` };
  if (action === "remove") return { ok: true, text: `\u5DF2\u79FB\u9664\u300C${name}\u300D\uFF08\u5DF2\u5148\u505C\u7528\u5E76\u62C6\u9664\u4F20\u8F93\uFF09` };
  return { ok: true, text: `\u5DF2\u505C\u7528\u300C${name}\u300D` };
}
function statusBadge(status) {
  if (status === "update") return { className: "wbh-badgeUpdate", text: "\u6709\u66F4\u65B0" };
  if (status === "current") return { className: "wbh-badgeCurrent", text: "\u5DF2\u662F\u6700\u65B0" };
  if (status === "unknown") return { className: "wbh-badgeUnknown", text: "\u65E0\u6CD5\u68C0\u67E5" };
  return null;
}
function InstalledRow({
  entry,
  confirming,
  busy,
  confirmRef,
  onAskRemove,
  onCancel,
  onConfirm,
  status,
  checking,
  updateConfirming,
  updateBusy,
  updateConfirmRef,
  onAskUpdate,
  onCancelUpdate,
  onConfirmUpdate
}) {
  const label = entry.record.displayName || entry.name;
  const badge = statusBadge(status?.status);
  const reason = String(status?.reason || "");
  const size = updatesSizeLabel([status ?? {}]);
  return /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row wbh-installedRow", "aria-busy": checking || updateBusy ? "true" : void 0 }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-installedName" }, label, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, " \xB7 ", entry.kind)), /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-installedActions" }, badge && /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: `wbh-badge ${badge.className}`,
      title: reason ? `${badge.text}\uFF1A${reason}` : badge.text,
      "aria-label": `${badge.text} ${label}${reason ? `\uFF1A${reason}` : ""}`
    },
    badge.text
  ), /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, entry.record.files || 0, " \u6587\u4EF6", entry.record.mcp ? " \xB7 MCP" : "", entry.record.source === "official" ? " \xB7 \u5B98\u65B9" : ""), updateConfirming ? /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: "wbh-confirmRow",
      role: "group",
      "aria-label": `\u786E\u8BA4\u66F4\u65B0 ${label}`,
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancelUpdate();
        }
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-confirmText" }, "\u786E\u8BA4\u66F4\u65B0\uFF1F", /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\uFF08\u4E0B\u8F7D ", size, "\uFF09")),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        ref: updateConfirmRef,
        type: "button",
        className: "wbh-btnPrimary wbh-updateConfirmBtn",
        disabled: updateBusy,
        "aria-label": `\u786E\u8BA4\u66F4\u65B0 ${label}`,
        onClick: onConfirmUpdate
      },
      updateBusy ? "\u66F4\u65B0\u4E2D\u2026" : "\u66F4\u65B0"
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-btnGhost",
        disabled: updateBusy,
        "aria-label": `\u53D6\u6D88\u66F4\u65B0 ${label}`,
        onClick: onCancelUpdate
      },
      "\u53D6\u6D88"
    )
  ) : confirming ? /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: "wbh-confirmRow",
      role: "group",
      "aria-label": `\u786E\u8BA4\u79FB\u9664 ${label}`,
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-confirmText" }, "\u786E\u8BA4\u79FB\u9664\uFF1F", /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\uFF08", removeHint(entry.kind), "\uFF09")),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        ref: confirmRef,
        type: "button",
        className: "wbh-btnDanger",
        disabled: busy,
        "aria-label": `\u786E\u8BA4\u79FB\u9664 ${label}`,
        onClick: onConfirm
      },
      busy ? "\u79FB\u9664\u4E2D\u2026" : "\u79FB\u9664"
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-btnGhost",
        disabled: busy,
        "aria-label": `\u53D6\u6D88\u79FB\u9664 ${label}`,
        onClick: onCancel
      },
      "\u53D6\u6D88"
    )
  ) : /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, status?.status === "update" && /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost wbh-updateBtn",
      disabled: updateBusy || checking,
      "aria-label": `\u66F4\u65B0 ${label}`,
      title: reason || `\u4E0B\u8F7D ${size}`,
      onClick: onAskUpdate
    },
    updateBusy ? "\u66F4\u65B0\u4E2D\u2026" : "\u66F4\u65B0"
  ), /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost wbh-removeBtn",
      disabled: busy,
      "aria-label": `\u79FB\u9664 ${label}`,
      onClick: onAskRemove
    },
    busy ? "\u79FB\u9664\u4E2D\u2026" : "\u79FB\u9664"
  ))));
}
function LocalMcpRow({
  server,
  confirming,
  busy,
  confirmRef,
  onAskRemove,
  onCancel,
  onConfirm,
  onToggle,
  toggling
}) {
  const label = server.name;
  const badge = localMcpBadge(server);
  return /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row wbh-localMcpRow", "aria-busy": busy || toggling ? "true" : void 0 }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-installedName" }, label, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, " \xB7 ", server.url), /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: `wbh-badge ${badge.className}`,
      title: badge.text,
      "aria-label": `${badge.text} ${label}`
    },
    badge.text
  ), /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\u5DE5\u5177 ", localMcpToolCount(server), server.tokenRef ? ` \xB7 \u51ED\u636E ${server.tokenRef}` : "")), /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-installedActions" }, confirming ? /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: "wbh-confirmRow",
      role: "group",
      "aria-label": `\u786E\u8BA4\u79FB\u9664 ${label}`,
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-confirmText" }, "\u786E\u8BA4\u79FB\u9664\uFF1F", /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\uFF08\u5148\u505C\u7528\u5E76\u62C6\u9664\u4F20\u8F93\uFF09")),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        ref: confirmRef,
        type: "button",
        className: "wbh-btnDanger",
        disabled: busy,
        "aria-label": `\u786E\u8BA4\u79FB\u9664 ${label}`,
        onClick: onConfirm
      },
      busy ? "\u79FB\u9664\u4E2D\u2026" : "\u79FB\u9664"
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-btnGhost",
        disabled: busy,
        "aria-label": `\u53D6\u6D88\u79FB\u9664 ${label}`,
        onClick: onCancel
      },
      "\u53D6\u6D88"
    )
  ) : /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost",
      disabled: toggling || busy,
      "aria-label": `${server.enabled ? "\u505C\u7528" : "\u542F\u7528"} ${label}`,
      "aria-busy": toggling ? "true" : void 0,
      onClick: onToggle
    },
    toggling ? server.enabled ? "\u505C\u7528\u4E2D\u2026" : "\u542F\u7528\u4E2D\u2026" : server.enabled ? "\u505C\u7528" : "\u542F\u7528"
  ), /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost wbh-removeBtn",
      disabled: busy || toggling,
      "aria-label": `\u79FB\u9664 ${label}`,
      onClick: onAskRemove
    },
    busy ? "\u79FB\u9664\u4E2D\u2026" : "\u79FB\u9664"
  ))));
}
function LocalMcpSection({
  guarded,
  reason,
  servers,
  loading,
  form,
  onChange,
  onSubmit,
  notice,
  confirmKey,
  busyKey,
  toggleKey,
  confirmRef,
  onAskRemove,
  onCancel,
  onConfirm,
  onToggle
}) {
  if (guarded) {
    return /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-localMcpSection" }, /* @__PURE__ */ import_react11.default.createElement("h2", { className: "wbh-secTitle", style: { marginTop: 22 } }, "\u672C\u5730 MCP \u670D\u52A1\u5668"), /* @__PURE__ */ import_react11.default.createElement("p", { className: "wbh-muted", role: "note" }, reason || "\u672C\u5730 MCP \u7BA1\u7406\u672A\u5F00\u542F\uFF1A\u8BF7\u5728\u63D2\u4EF6\u914D\u7F6E\u91CC\u8BBE localMcp: true\uFF08\u9ED8\u8BA4\u5173\u95ED\uFF09"));
  }
  return /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-localMcpSection" }, /* @__PURE__ */ import_react11.default.createElement("h2", { className: "wbh-secTitle", style: { marginTop: 22 } }, "\u672C\u5730 MCP \u670D\u52A1\u5668\uFF08", servers.length, "\uFF09"), /* @__PURE__ */ import_react11.default.createElement("p", { className: "wbh-muted" }, "\u53EA\u6709\u672C\u673A\u5730\u5740\uFF08127.0.0.1 / localhost / ::1\uFF09\u53EF\u4EE5\u6CE8\u518C\uFF1Btoken \u53EA\u5B58\u5165 DSH \u51ED\u636E\u5E93 \uFF08~/.dsh/.credentials.yaml\uFF0C0600\uFF09\uFF0C\u4E0D\u843D\u4EFB\u4F55\u914D\u7F6E\u6587\u4EF6\u3001\u4E0D\u56DE\u663E\u3002\u542F\u7528\u7684\u670D\u52A1\u5668\u4F1A\u4EE5 mcp__<\u540D\u5B57>__<\u5DE5\u5177> \u7684\u547D\u540D\u7A7A\u95F4\u66B4\u9732\u7ED9\u6A21\u578B\u3002"), notice && /* @__PURE__ */ import_react11.default.createElement("p", { className: `wbh-removeNotice${notice.ok ? "" : " is-error"}`, role: notice.ok ? "status" : "alert", "aria-live": "polite" }, notice.text), servers.length === 0 && !loading && /* @__PURE__ */ import_react11.default.createElement("p", { className: "wbh-muted" }, "\u5C1A\u672A\u6CE8\u518C\u4EFB\u4F55\u672C\u5730 MCP \u670D\u52A1\u5668\u3002"), servers.map((server) => /* @__PURE__ */ import_react11.default.createElement(
    LocalMcpRow,
    {
      key: server.name,
      server,
      confirming: confirmKey === server.name,
      busy: busyKey === server.name,
      toggling: toggleKey === server.name,
      confirmRef,
      onAskRemove: () => onAskRemove(server.name),
      onCancel,
      onConfirm: () => onConfirm(server.name),
      onToggle: () => onToggle(server.name)
    }
  )), /* @__PURE__ */ import_react11.default.createElement(
    "form",
    {
      className: "wbh-localMcpForm",
      "aria-label": "\u6CE8\u518C\u672C\u5730 MCP \u670D\u52A1\u5668",
      onSubmit: (event) => {
        event.preventDefault();
        onSubmit();
      }
    },
    /* @__PURE__ */ import_react11.default.createElement(
      "input",
      {
        className: "wbh-localMcpInput",
        type: "text",
        value: form.name,
        placeholder: "\u540D\u79F0\uFF08\u5982 scrapling\uFF09",
        "aria-label": "\u672C\u5730 MCP \u540D\u79F0",
        onChange: (event) => onChange({ ...form, name: event.target.value })
      }
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "input",
      {
        className: "wbh-localMcpInput wbh-localMcpUrl",
        type: "text",
        value: form.url,
        placeholder: "http://127.0.0.1:8002/mcp",
        "aria-label": "\u672C\u5730 MCP URL\uFF08\u4EC5\u672C\u673A\u5730\u5740\uFF09",
        onChange: (event) => onChange({ ...form, url: event.target.value })
      }
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "input",
      {
        className: "wbh-localMcpInput wbh-localMcpToken",
        type: "password",
        autoComplete: "off",
        value: form.token,
        placeholder: "token\uFF08\u53EF\u9009\uFF0C\u5B58\u5165\u51ED\u636E\u5E93\uFF0C\u4E0D\u56DE\u663E\uFF09",
        "aria-label": "\u672C\u5730 MCP token\uFF08\u53EF\u9009\uFF0C\u5B58\u5165\u51ED\u636E\u5E93\uFF0C\u4E0D\u56DE\u663E\uFF09",
        onChange: (event) => onChange({ ...form, token: event.target.value })
      }
    ),
    /* @__PURE__ */ import_react11.default.createElement("button", { type: "submit", className: "wbh-btnPrimary", "aria-label": "\u6CE8\u518C\u672C\u5730 MCP \u670D\u52A1\u5668", "aria-busy": form.busy ? "true" : void 0, disabled: form.busy }, form.busy ? "\u6CE8\u518C\u4E2D\u2026" : "\u6CE8\u518C")
  ));
}
function SettingsPage() {
  const [auth, setAuth] = (0, import_react11.useState)(null);
  const [installed, setInstalled] = (0, import_react11.useState)({});
  const [showAuth, setShowAuth] = (0, import_react11.useState)(false);
  const [confirmKey, setConfirmKey] = (0, import_react11.useState)("");
  const [busyKey, setBusyKey] = (0, import_react11.useState)("");
  const [notice, setNotice] = (0, import_react11.useState)(null);
  const confirmRef = (0, import_react11.useRef)(null);
  const [updates, setUpdates] = (0, import_react11.useState)(null);
  const [checking, setChecking] = (0, import_react11.useState)(false);
  const [updateConfirmKey, setUpdateConfirmKey] = (0, import_react11.useState)("");
  const [updateBusyKey, setUpdateBusyKey] = (0, import_react11.useState)("");
  const [updateNoticeState, setUpdateNoticeState] = (0, import_react11.useState)(null);
  const updateConfirmRef = (0, import_react11.useRef)(null);
  const loadInstalled = (0, import_react11.useCallback)(async () => {
    try {
      setInstalled(await hub.installed());
    } catch {
    }
  }, []);
  const refresh = (0, import_react11.useCallback)(async () => {
    try {
      setAuth(await refreshAuth());
    } catch {
      setAuth({ configured: false });
    }
    await loadInstalled();
  }, [loadInstalled]);
  (0, import_react11.useEffect)(() => {
    void refresh();
  }, [refresh]);
  (0, import_react11.useEffect)(() => onAuthChange(setAuth), []);
  (0, import_react11.useEffect)(() => {
    if (confirmKey) confirmRef.current?.focus?.();
  }, [confirmKey]);
  (0, import_react11.useEffect)(() => {
    if (updateConfirmKey) updateConfirmRef.current?.focus?.();
  }, [updateConfirmKey]);
  const loggedIn = auth?.configured === true;
  const stale = loggedIn && auth?.stale === true;
  const entries = Object.entries(installed).map(([key, record]) => {
    const slash = key.indexOf("/");
    return {
      key,
      kind: slash > 0 ? key.slice(0, slash) : record?.kind || "",
      name: slash > 0 ? key.slice(slash + 1) : record?.name || "",
      record: record || {}
    };
  });
  const checkUpdates = (0, import_react11.useCallback)(async ({ refresh: force = false } = {}) => {
    setChecking(true);
    setUpdateNoticeState(null);
    try {
      setUpdates(await hub.updates({ refresh: force }));
    } catch (error) {
      setUpdates({
        ok: false,
        entries: [],
        counts: { update: 0, current: 0, unknown: 0 },
        sources: {},
        error: updateFailureReason(error)
      });
    } finally {
      setChecking(false);
    }
  }, []);
  const statusByKey = new Map((updates?.ok === false ? [] : updates?.entries ?? []).map((item) => [item.key, item]));
  const statusFor = (0, import_react11.useCallback)((entry) => {
    if (!updates) return null;
    if (updates.ok === false) return { status: "unknown", reason: updates.error || "\u68C0\u67E5\u5931\u8D25" };
    return statusByKey.get(entry.key) ?? { status: "unknown", reason: "\u672C\u6B21\u68C0\u67E5\u672A\u8FD4\u56DE\u8BE5\u6761\u76EE" };
  }, [updates, statusByKey]);
  const rows = entries.map((entry) => ({ ...entry, status: statusFor(entry) }));
  const updatable = rows.filter((row) => row.status?.status === "update");
  const checkFailed = updates?.ok === false;
  const sources = updates?.sources ?? {};
  const officialDown = sources.official?.ok === false;
  const remove = (0, import_react11.useCallback)(async (entry) => {
    const label = entry.record.displayName || entry.name;
    setBusyKey(entry.key);
    setNotice(null);
    let result = { ok: true };
    try {
      await hub.uninstall(entry.kind, entry.name);
    } catch (error) {
      result = { ok: false, error: String(error?.message || error), status: error?.status };
    }
    setNotice(uninstallNotice(entry.kind, label, result));
    setBusyKey("");
    setConfirmKey("");
    await loadInstalled();
  }, [loadInstalled]);
  const installEntry = (0, import_react11.useCallback)(async (entry) => {
    const result = await hub.install(
      entry.kind,
      entry.name,
      entry.record.source === "official" ? "official" : void 0
    );
    if (entry.kind === "connector" && entry.record.enabled) {
      try {
        await hub.disableConnector(entry.name);
      } catch {
      }
      await hub.enableConnector(entry.name);
    }
    return result;
  }, []);
  const updateOne = (0, import_react11.useCallback)(async (entry) => {
    const label = entry.record.displayName || entry.name;
    setUpdateBusyKey(entry.key);
    setUpdateNoticeState(null);
    let result = { ok: true };
    try {
      await installEntry(entry);
    } catch (error) {
      result = { ok: false, message: String(error?.message || error), status: error?.status };
    }
    setUpdateNoticeState(updateNotice(entry.kind, label, result));
    setUpdateBusyKey("");
    setUpdateConfirmKey("");
    await loadInstalled();
    if (result.ok) await checkUpdates({ refresh: true });
  }, [checkUpdates, installEntry, loadInstalled]);
  const updateAll = (0, import_react11.useCallback)(async (list) => {
    setUpdateBusyKey("__all__");
    setUpdateNoticeState(null);
    const failures = [];
    let done = 0;
    for (const entry of list) {
      const label = entry.record.displayName || entry.name;
      try {
        await installEntry(entry);
        done += 1;
      } catch (error) {
        failures.push(`${label}\uFF1A${updateFailureReason({ message: String(error?.message || error), status: error?.status })}`);
      }
    }
    setUpdateNoticeState(failures.length === 0 ? { ok: true, text: `\u5DF2\u66F4\u65B0 ${done} \u9879` } : { ok: false, text: `\u5DF2\u66F4\u65B0 ${done} \u9879\uFF0C${failures.length} \u9879\u5931\u8D25 \u2014\u2014 ${failures.join("\uFF1B")}` });
    setUpdateBusyKey("");
    setUpdateConfirmKey("");
    await loadInstalled();
    await checkUpdates({ refresh: true });
  }, [checkUpdates, installEntry, loadInstalled]);
  const [localMcp, setLocalMcp] = (0, import_react11.useState)(null);
  const [localForm, setLocalForm] = (0, import_react11.useState)({ name: "", url: "", token: "", busy: false });
  const [localNotice, setLocalNotice] = (0, import_react11.useState)(null);
  const [localConfirmKey, setLocalConfirmKey] = (0, import_react11.useState)("");
  const [localBusyKey, setLocalBusyKey] = (0, import_react11.useState)("");
  const [localToggleKey, setLocalToggleKey] = (0, import_react11.useState)("");
  const localConfirmRef = (0, import_react11.useRef)(null);
  (0, import_react11.useEffect)(() => {
    if (localConfirmKey) localConfirmRef.current?.focus?.();
  }, [localConfirmKey]);
  const loadLocalMcp = (0, import_react11.useCallback)(async () => {
    try {
      setLocalMcp(await hub.localMcpList());
    } catch {
    }
  }, []);
  (0, import_react11.useEffect)(() => {
    void loadLocalMcp();
  }, [loadLocalMcp]);
  const submitLocalMcp = (0, import_react11.useCallback)(async () => {
    const problem = validateLocalMcpForm(localForm.name, localForm.url, localForm.token);
    if (problem) {
      setLocalNotice({ ok: false, text: problem });
      return;
    }
    setLocalForm((prev) => ({ ...prev, busy: true }));
    setLocalNotice(null);
    let result = null;
    try {
      result = await hub.localMcpSave(localForm.name.trim(), localForm.url.trim(), localForm.token);
      setLocalForm({ name: "", url: "", token: "", busy: false });
      setLocalNotice(localMcpSaveNotice(result));
    } catch (error) {
      setLocalForm((prev) => ({ ...prev, token: "", busy: false }));
      setLocalNotice(localMcpSaveNotice({ ok: false, error: String(error?.message || error), status: error?.status }));
      return;
    }
    await loadLocalMcp();
    if (result?.ok === true && result.server?.enabled !== true) {
      try {
        const enabled = await hub.localMcpEnable(result.server.name);
        setLocalNotice(localMcpActionNotice("enable", result.server.name, enabled));
        await loadLocalMcp();
      } catch (error) {
        setLocalNotice(localMcpActionNotice("enable", result.server.name, { ok: false, error: String(error?.message || error) }));
      }
    }
  }, [localForm, loadLocalMcp]);
  const toggleLocalMcp = (0, import_react11.useCallback)(async (name) => {
    const server = (localMcp?.servers ?? []).find((s) => s.name === name);
    const action = server?.enabled ? "disable" : "enable";
    setLocalToggleKey(name);
    setLocalNotice(null);
    try {
      const result = action === "enable" ? await hub.localMcpEnable(name) : await hub.localMcpDisable(name);
      setLocalNotice(localMcpActionNotice(action, name, result));
    } catch (error) {
      setLocalNotice(localMcpActionNotice(action, name, { ok: false, error: String(error?.message || error), status: error?.status }));
    }
    setLocalToggleKey("");
    await loadLocalMcp();
  }, [localMcp, loadLocalMcp]);
  const removeLocalMcp = (0, import_react11.useCallback)(async (name) => {
    setLocalBusyKey(name);
    setLocalNotice(null);
    let result = { ok: true };
    try {
      await hub.localMcpRemove(name);
    } catch (error) {
      result = { ok: false, error: String(error?.message || error), status: error?.status };
    }
    setLocalNotice(localMcpActionNotice("remove", name, result));
    setLocalBusyKey("");
    setLocalConfirmKey("");
    await loadLocalMcp();
  }, [loadLocalMcp]);
  return /* @__PURE__ */ import_react11.default.createElement("section", { className: "wbh-settings" }, /* @__PURE__ */ import_react11.default.createElement("h2", { className: "wbh-secTitle" }, "\u817E\u8BAF\u8D26\u53F7\uFF08\u5B98\u65B9\u5E02\u573A\u6570\u636E\uFF09"), /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-authState" }, /* @__PURE__ */ import_react11.default.createElement("i", { className: `wbh-dot${loggedIn && !stale ? "" : " off"}` }), stale ? `\u767B\u5F55\u5DF2\u5931\u6548${auth?.nickname ? ` \xB7 ${auth.nickname}` : ""} \u2014 ${auth?.lastError || STALE_LOGIN_REASON}` : loggedIn ? `\u5DF2\u767B\u5F55${auth?.nickname ? ` \xB7 ${auth.nickname}` : ""}` : "\u672A\u767B\u5F55 \u2014 \u5B98\u65B9\u4E13\u5BB6/\u6280\u80FD\u76EE\u5F55\u4E0E\u7528\u91CF\u6570\u636E\u9700\u8981\u767B\u5F55"), loggedIn && !stale ? /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: async () => {
    await hub.authLogout();
    await refresh();
  } }, "\u6CE8\u9500") : /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: () => setShowAuth(true) }, "\u626B\u7801\u767B\u5F55")), loggedIn && !stale && auth?.expiresAt && /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\u6388\u6743\u5230\u671F\uFF1A", new Date(auth.expiresAt).toLocaleString("zh-CN"), "\uFF1Btoken \u5230\u671F\u524D\u81EA\u52A8\u5237\u65B0\uFF08\u540E\u53F0\u6BCF 30 \u5206\u949F\u5DE1\u68C0\u4E00\u6B21\u4FDD\u6D3B\uFF09")), stale && /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row" }, /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\u540E\u53F0\u4FDD\u6D3B\u5DF2\u8FDE\u7EED\u5931\u8D25 ", auth?.keepalive?.consecutiveFailures ?? 0, " \u6B21", auth?.keepalive?.lastCheckAt ? `\uFF08\u6700\u540E\u5DE1\u68C0 ${new Date(auth.keepalive.lastCheckAt).toLocaleString("zh-CN")}\uFF09` : "", "\uFF1Brefresh_token \u5DF2\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u626B\u7801\u767B\u5F55\u3002")), /* @__PURE__ */ import_react11.default.createElement("h2", { className: "wbh-secTitle", style: { marginTop: 22 } }, "\u5DF2\u5B89\u88C5\uFF08", entries.length, "\uFF09"), /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-row wbh-updateBar" }, /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: `wbh-updateSummary${checkFailed ? " is-error" : ""}`,
      role: "status",
      "aria-live": "polite"
    },
    checkSummaryText(updates, checking)
  ), /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-installedActions" }, updatable.length > 0 && (updateConfirmKey === "__all__" ? /* @__PURE__ */ import_react11.default.createElement(
    "span",
    {
      className: "wbh-confirmRow",
      role: "group",
      "aria-label": "\u786E\u8BA4\u5168\u90E8\u66F4\u65B0",
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setUpdateConfirmKey("");
        }
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-confirmText" }, "\u786E\u8BA4\u66F4\u65B0 ", updatable.length, " \u9879\uFF1F", /* @__PURE__ */ import_react11.default.createElement("span", { className: "wbh-muted" }, "\uFF08\u603B\u4E0B\u8F7D\u91CF ", updatesSizeLabel(updatable), "\uFF09")),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        ref: updateConfirmRef,
        type: "button",
        className: "wbh-btnPrimary",
        disabled: updateBusyKey === "__all__",
        "aria-label": `\u786E\u8BA4\u5168\u90E8\u66F4\u65B0 ${updatable.length} \u9879`,
        onClick: () => void updateAll(updatable)
      },
      updateBusyKey === "__all__" ? "\u66F4\u65B0\u4E2D\u2026" : "\u66F4\u65B0"
    ),
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-btnGhost",
        disabled: updateBusyKey === "__all__",
        "aria-label": "\u53D6\u6D88\u5168\u90E8\u66F4\u65B0",
        onClick: () => setUpdateConfirmKey("")
      },
      "\u53D6\u6D88"
    )
  ) : /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost wbh-updateAllBtn",
      disabled: updateBusyKey !== "" || checking,
      "aria-label": `\u5168\u90E8\u66F4\u65B0 ${updatable.length} \u9879`,
      onClick: () => {
        setNotice(null);
        setConfirmKey("");
        setUpdateConfirmKey("__all__");
      }
    },
    updateBusyKey === "__all__" ? "\u66F4\u65B0\u4E2D\u2026" : `\u5168\u90E8\u66F4\u65B0\uFF08${updatable.length}\uFF09`
  )), /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-btnGhost wbh-checkBtn",
      "aria-busy": checking ? "true" : void 0,
      disabled: checking || updateBusyKey !== "",
      "aria-label": "\u68C0\u67E5\u66F4\u65B0",
      onClick: () => void checkUpdates({ refresh: true })
    },
    checking ? "\u68C0\u67E5\u4E2D\u2026" : "\u68C0\u67E5\u66F4\u65B0"
  ))), officialDown && /* @__PURE__ */ import_react11.default.createElement("p", { className: "wbh-updateWarn", role: "status" }, "\u5B98\u65B9\u6570\u636E\u6E90\u4E0D\u53EF\u7528\uFF1A", sources.official.reason, " \u2014\u2014 \u76F8\u5173\u6761\u76EE\u663E\u793A\u300C\u65E0\u6CD5\u68C0\u67E5\u300D\u3002", !loggedIn && "\uFF08\u6280\u80FD\u4E0E\u8FDE\u63A5\u5668\u7684\u68C0\u67E5\u9700\u8981\u767B\u5F55\u5B98\u65B9\u8D26\u53F7\uFF09"), updateNoticeState && /* @__PURE__ */ import_react11.default.createElement(
    "p",
    {
      className: `wbh-removeNotice${updateNoticeState.ok ? "" : " is-error"}`,
      role: updateNoticeState.ok ? "status" : "alert",
      "aria-live": "polite"
    },
    updateNoticeState.text
  ), notice && /* @__PURE__ */ import_react11.default.createElement("p", { className: `wbh-removeNotice${notice.ok ? "" : " is-error"}`, role: notice.ok ? "status" : "alert", "aria-live": "polite" }, notice.text), entries.length === 0 && /* @__PURE__ */ import_react11.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react11.default.createElement("p", null, "\u5728\u8F93\u5165\u6846\u300C\uFF0B\u300D\u6216\u5DE6\u4FA7\u5165\u53E3\u6D4F\u89C8\u5E02\u573A\u3002")), rows.map((row) => /* @__PURE__ */ import_react11.default.createElement(
    InstalledRow,
    {
      key: row.key,
      entry: row,
      status: row.status,
      checking,
      confirming: confirmKey === row.key,
      busy: busyKey === row.key,
      confirmRef,
      onAskRemove: () => {
        setNotice(null);
        setUpdateConfirmKey("");
        setConfirmKey(row.key);
      },
      onCancel: () => setConfirmKey(""),
      onConfirm: () => void remove(row),
      updateConfirming: updateConfirmKey === row.key,
      updateBusy: updateBusyKey === row.key,
      updateConfirmRef,
      onAskUpdate: () => {
        setUpdateNoticeState(null);
        setConfirmKey("");
        setUpdateConfirmKey(row.key);
      },
      onCancelUpdate: () => setUpdateConfirmKey(""),
      onConfirmUpdate: () => void updateOne(row)
    }
  )), /* @__PURE__ */ import_react11.default.createElement(
    LocalMcpSection,
    {
      guarded: localMcp?.guarded === true,
      reason: localMcp?.reason || "",
      servers: localMcp?.servers ?? [],
      loading: localMcp === null,
      form: localForm,
      onChange: setLocalForm,
      onSubmit: () => void submitLocalMcp(),
      notice: localNotice,
      confirmKey: localConfirmKey,
      busyKey: localBusyKey,
      toggleKey: localToggleKey,
      confirmRef: localConfirmRef,
      onAskRemove: (name) => {
        setLocalNotice(null);
        setLocalConfirmKey(name);
      },
      onCancel: () => setLocalConfirmKey(""),
      onConfirm: (name) => void removeLocalMcp(name),
      onToggle: (name) => void toggleLocalMcp(name)
    }
  ), /* @__PURE__ */ import_react11.default.createElement("p", { className: "wbh-muted", style: { marginTop: 16 } }, "\u9700\u8981 OAuth \u6216 API Key \u7684\u8FDE\u63A5\u5668\u4F1A\u5728\u542F\u7528\u65F6\u53D1\u8D77\u72EC\u7ACB\u6388\u6743\uFF1B\u672C\u9875\u4E0E\u6D4F\u89C8\u5668\u7AEF\u4E0D\u4F1A\u5C55\u793A\u4EFB\u4F55\u51ED\u636E\u503C\u3002 \u79FB\u9664\u8FDE\u63A5\u5668\u4F1A\u5148\u505C\u7528\uFF08\u62C6\u6389 MCP \u4F20\u8F93\uFF09\u518D\u5220\u6587\u4EF6\uFF1B\u79FB\u9664\u4E13\u5BB6\u4F1A\u4E00\u5E76\u6458\u6389\u5404\u4F1A\u8BDD\u91CC\u7684\u6302\u8F7D\u3002 \u66F4\u65B0 = \u91CD\u65B0\u4E0B\u8F7D\u5B89\u88C5\uFF08\u5148\u6E05\u76EE\u5F55\u518D\u843D\u76D8\uFF09\u3002\u68C0\u67E5\u66F4\u65B0\u53EA\u6BD4**\u5B98\u65B9\u5143\u6570\u636E**\uFF1A\u6280\u80FD\u6BD4\u5B98\u65B9 version\u3001 \u4E13\u5BB6\u6BD4\u5B98\u65B9 updatedAt\u3001\u8FDE\u63A5\u5668\u6BD4\u5B98\u65B9 MCP \u5B9A\u4E49\u54C8\u5E0C\uFF1B\u53D6\u4E0D\u5230\u5B98\u65B9\u6570\u636E\uFF08\u672A\u767B\u5F55/\u63A5\u53E3\u4E0D\u53EF\u7528/ \u8BB0\u5F55\u7F3A\u5B89\u88C5\u65F6\u6EAF\u6E90\uFF09\u4E00\u5F8B\u663E\u793A\u300C\u65E0\u6CD5\u68C0\u67E5\u300D\uFF0C\u7EDD\u4E0D\u663E\u793A\u300C\u5DF2\u662F\u6700\u65B0\u300D\u3002"), showAuth && /* @__PURE__ */ import_react11.default.createElement(WbAuthCard, { reason: stale ? STALE_LOGIN_REASON : "", onClose: () => {
    setShowAuth(false);
    void refresh();
  } }));
}

// src/IdleSlot.jsx
var import_react13 = __toESM(require("react"), 1);

// src/IdleCard.jsx
var import_react12 = __toESM(require("react"), 1);
var TYPE_LABEL = { skill: "\u6280\u80FD", mcp: "MCP" };
var ICON = {
  skill: /* @__PURE__ */ import_react12.default.createElement("svg", { viewBox: "0 0 16 16", width: "16", height: "16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react12.default.createElement("path", { d: "M8 2.2 13 5v6l-5 2.8L3 11V5l5-2.8Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }), /* @__PURE__ */ import_react12.default.createElement("path", { d: "M3.2 5.1 8 7.8l4.8-2.7M8 7.8V13.6", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" })),
  mcp: /* @__PURE__ */ import_react12.default.createElement("svg", { viewBox: "0 0 16 16", width: "16", height: "16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react12.default.createElement("rect", { x: "2.4", y: "2.4", width: "11.2", height: "11.2", rx: "3", stroke: "currentColor", strokeWidth: "1.2" }), /* @__PURE__ */ import_react12.default.createElement("circle", { cx: "8", cy: "8", r: "2.2", stroke: "currentColor", strokeWidth: "1.2" }))
};
var CARET = `<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function keyOf(row) {
  return `${row.type}:${row.id}`;
}
function lastUsedText(row, today) {
  if (!row.lastUsedDate) return "\u4ECE\u672A\u4F7F\u7528";
  if (row.lastUsedDate === today) return "\u4ECA\u5929";
  return `${row.idleDays} \u5929\u524D`;
}
function Checkbox({ checked, onChange, label }) {
  return /* @__PURE__ */ import_react12.default.createElement(
    "span",
    {
      role: "checkbox",
      "aria-checked": checked,
      "aria-label": label,
      tabIndex: 0,
      className: "cb-checkbox " + (checked ? "cb-checkbox--checked" : ""),
      onClick: (event) => {
        event.stopPropagation();
        onChange();
      },
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onChange();
        }
      }
    },
    /* @__PURE__ */ import_react12.default.createElement("span", { className: "cb-checkbox__box" })
  );
}
function IdleCard({ data, onClose, onDismiss, onDismissGlobal, onDisable, onManage, defaultExpanded = false }) {
  const rows = data?.candidates ?? [];
  const threshold = data?.threshold ?? 14;
  const today = data?.today ?? "";
  const [expanded, setExpanded] = (0, import_react12.useState)(defaultExpanded);
  const [checkedKeys, setCheckedKeys] = (0, import_react12.useState)(() => /* @__PURE__ */ new Set());
  const [busy, setBusy] = (0, import_react12.useState)(false);
  const activeKeys = (0, import_react12.useMemo)(() => new Set(rows.map(keyOf)), [rows]);
  const selected = (0, import_react12.useMemo)(() => [...checkedKeys].filter((k) => activeKeys.has(k)), [checkedKeys, activeKeys]);
  const allChecked = rows.length > 0 && selected.length === rows.length;
  if (rows.length === 0) return null;
  const toggle = (row) => {
    const key = keyOf(row);
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const toggleAll = () => {
    setCheckedKeys(allChecked ? /* @__PURE__ */ new Set() : new Set(rows.map(keyOf)));
  };
  const disableSelected = async () => {
    if (selected.length === 0 || busy) return;
    setBusy(true);
    try {
      await onDisable?.(selected.map((k) => {
        const [type, ...rest] = k.split(":");
        return { type, id: rest.join(":") };
      }));
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ import_react12.default.createElement("div", { className: "wbh-port" }, /* @__PURE__ */ import_react12.default.createElement(
    "div",
    {
      className: "idle-capability-pill" + (expanded ? " idle-capability-pill--detail" : ""),
      role: "region",
      "aria-label": "\u95F2\u7F6E\u80FD\u529B\u63D0\u9192"
    },
    /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "idle-capability-pill__close", onClick: onClose, "aria-label": "\u5173\u95ED\u63D0\u9192" }, "\u2715"),
    /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__title" }, rows.length, " \u9879\u6280\u80FD\u6216 MCP \u5DF2\u81F3\u5C11 ", threshold, " \u5929\u672A\u4F7F\u7528\uFF0C\u5EFA\u8BAE\u68C0\u67E5\u540E\u5173\u95ED\u3002"),
    /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__body" }, "\u5DF2\u6302\u8F7D\u7684\u6280\u80FD\u548C\u5DF2\u542F\u7528\u7684 MCP \u4F1A\u628A\u8BF4\u660E\u9001\u8FDB\u6A21\u578B\u4E0A\u4E0B\u6587\uFF0C\u95F2\u7F6E\u7684\u4ECD\u7136\u5360\u7528\u989D\u5EA6\u3002", /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "idle-capability-pill__manage-link", onClick: onManage }, "\u7BA1\u7406\u9875"), "\u91CC\u53EF\u4EE5\u968F\u65F6\u5F00\u56DE\u6765\u3002"),
    expanded && /* @__PURE__ */ import_react12.default.createElement(import_react12.default.Fragment, null, /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__select-row" }, /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__select-count" }, "\u5DF2\u9009 ", selected.length, " \u9879")), /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__list" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__list-head" }, /* @__PURE__ */ import_react12.default.createElement(Checkbox, { checked: allChecked, onChange: toggleAll, label: "\u5168\u9009" }), /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__list-head-name" }, "\u7C7B\u578B\u4E0E\u540D\u79F0"), /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__list-head-date" }, "\u6700\u540E\u4F7F\u7528")), rows.map((row) => {
      const key = keyOf(row);
      const on = selected.includes(key);
      return /* @__PURE__ */ import_react12.default.createElement("div", { key, className: "idle-capability-pill__list-row", onClick: () => toggle(row) }, /* @__PURE__ */ import_react12.default.createElement(Checkbox, { checked: on, onChange: () => toggle(row), label: row.name }), /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__list-icon", "aria-label": TYPE_LABEL[row.type] ?? row.type }, ICON[row.type] ?? ICON.skill), /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__list-name" }, row.name), /* @__PURE__ */ import_react12.default.createElement("span", { className: "idle-capability-pill__list-date" }, lastUsedText(row, today)));
    }))),
    /* @__PURE__ */ import_react12.default.createElement("div", { className: "idle-capability-pill__actions" }, /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "idle-capability-pill__detail-link", onClick: () => setExpanded((v) => !v) }, /* @__PURE__ */ import_react12.default.createElement("span", null, expanded ? "\u6536\u8D77\u8BE6\u60C5" : "\u67E5\u770B\u8BE6\u60C5"), /* @__PURE__ */ import_react12.default.createElement(
      "span",
      {
        className: "idle-capability-pill__detail-caret" + (expanded ? " idle-capability-pill__detail-caret--up" : ""),
        "aria-hidden": "true",
        dangerouslySetInnerHTML: { __html: CARET }
      }
    )), /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "wbh-idle-btn wbh-idle-btn--secondary", onClick: onDismissGlobal, disabled: busy }, "\u4E0D\u518D\u63D0\u9192"), /* @__PURE__ */ import_react12.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-idle-btn wbh-idle-btn--primary",
        onClick: disableSelected,
        disabled: selected.length === 0 || busy
      },
      busy ? "\u5173\u95ED\u4E2D\u2026" : "\u4E00\u952E\u5173\u95ED"
    ))
  ));
}

// src/IdleSlot.jsx
function IdleSlot({ ctx }) {
  const [data, setData] = (0, import_react13.useState)(null);
  const [closed, setClosed] = (0, import_react13.useState)(false);
  const [toast, setToast] = (0, import_react13.useState)(null);
  const reported = (0, import_react13.useRef)(false);
  const toastTimer = (0, import_react13.useRef)(null);
  (0, import_react13.useEffect)(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);
  (0, import_react13.useEffect)(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await idleList();
        if (cancelled) return;
        if (result?.candidates?.length > 0 && !result.blockedBy) {
          setData(result);
          if (!reported.current) {
            reported.current = true;
            idleShown().catch(() => {
            });
          }
        }
      } catch {
      }
    }, 3e3);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  if (closed || !data) return null;
  const onDisable = async (items) => {
    const result = await idleClose(items);
    const closedKeys = new Set(result?.succeeded ?? []);
    setData((prev) => {
      if (!prev) return prev;
      const rest = prev.candidates.filter((c) => !closedKeys.has(`${c.type}:${c.id}`));
      return { ...prev, candidates: rest };
    });
    if (closedKeys.size > 0) {
      setToast({ count: closedKeys.size });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 5e3);
    }
    if (result?.failed?.length) {
      console.warn("[wbh] idle close partially failed:", result.failed);
    }
  };
  const onDismissGlobal = async () => {
    setClosed(true);
    await idleDismissGlobal().catch(() => {
    });
  };
  const gotoManage = () => {
    try {
      openMarket?.();
    } catch {
    }
  };
  return /* @__PURE__ */ import_react13.default.createElement(import_react13.default.Fragment, null, data && !closed && /* @__PURE__ */ import_react13.default.createElement(
    IdleCard,
    {
      data,
      onClose: () => setClosed(true),
      onDismissGlobal,
      onDisable,
      onManage: gotoManage
    }
  ), toast && /* @__PURE__ */ import_react13.default.createElement("div", { className: "wbh-port" }, /* @__PURE__ */ import_react13.default.createElement("div", { className: "idle-capability-toast", role: "status" }, /* @__PURE__ */ import_react13.default.createElement("span", null, "\u5DF2\u5173\u95ED ", toast.count, " \u9879\u6280\u80FD\u6216 MCP\uFF0C\u53EF\u968F\u65F6\u5728"), /* @__PURE__ */ import_react13.default.createElement("button", { type: "button", className: "idle-capability-toast__manage-link", onClick: gotoManage }, "\u7BA1\u7406\u9875"), /* @__PURE__ */ import_react13.default.createElement("span", null, "\u91CD\u65B0\u5F00\u542F\u3002"))));
}

// src/index.jsx
var pluginCtx = null;
function runCommand(sessionId, line) {
  if (!sessionId) return Promise.resolve({ ok: false, error: "\u5F53\u524D\u6CA1\u6709\u4F1A\u8BDD\uFF0C\u65E0\u6CD5\u6267\u884C\u547D\u4EE4" });
  let remote = null;
  try {
    remote = pluginCtx?.get?.("remote.commands") ?? null;
  } catch {
    remote = null;
  }
  if (!remote) return Promise.resolve({ ok: false, error: "\u547D\u4EE4\u901A\u9053\u4E0D\u53EF\u7528\uFF08remotes \u672A\u5C31\u7EEA\uFF09" });
  return remote.execute(sessionId, line, []).then((result) => result?.ok ? { ok: true, value: result.value?.result } : { ok: false, error: result?.error?.message || "\u547D\u4EE4\u6267\u884C\u5931\u8D25" }).catch((error) => ({ ok: false, error: String(error?.message || error) }));
}
var MAIN_SESSION_SELECTOR = (state) => {
  const byId = state?.byId ?? {};
  const current = state?.current;
  const mainOf = (id) => (byId[id]?.retainedBy?.mainView ?? 0) > 0;
  if (current && mainOf(current)) return current;
  return Object.values(byId).find((session) => (session?.retainedBy?.mainView ?? 0) > 0)?.id;
};
function resolveWorkspaceId(workspaces, sessionsById, currentSessionId) {
  const items = Array.isArray(workspaces?.items) ? workspaces.items : [];
  if (currentSessionId) {
    const ws = items.find((w) => Array.isArray(w?.sessionIds) && w.sessionIds.includes(currentSessionId));
    if (ws?.workspaceId) return ws.workspaceId;
  }
  let latestCwd = null;
  let latestTime = Number.NEGATIVE_INFINITY;
  for (const id of Object.keys(sessionsById || {})) {
    const s = sessionsById?.[id];
    if (s?.cwd && (s.updatedAt ?? 0) > latestTime) {
      latestTime = s.updatedAt;
      latestCwd = s.cwd;
    }
  }
  if (latestCwd) {
    const ws = items.find((w) => w?.path === latestCwd);
    if (ws?.workspaceId) return ws.workspaceId;
  }
  let selected = null;
  let selectedTime = Number.NEGATIVE_INFINITY;
  for (const w of items) {
    let latest = Number.NEGATIVE_INFINITY;
    for (const sid of Array.isArray(w?.sessionIds) ? w.sessionIds : []) {
      const s = sessionsById?.[sid];
      if (s?.updatedAt != null) latest = Math.max(latest, s.updatedAt);
    }
    if (latest === Number.NEGATIVE_INFINITY && w?.createdAt) latest = Date.parse(w.createdAt);
    if (selected === null || latest > selectedTime) {
      selected = w.workspaceId;
      selectedTime = latest;
    }
  }
  return selected || void 0;
}
function HubPageWithSessions({ useSessions, useWorkspaces, sessionId }) {
  const mainSessionId = useSessions(MAIN_SESSION_SELECTOR);
  const sessionsById = useSessions((state) => state?.byId ?? {});
  const workspaces = typeof useWorkspaces === "function" ? useWorkspaces((state) => state) : null;
  const workspaceId = resolveWorkspaceId(workspaces, sessionsById, mainSessionId);
  return /* @__PURE__ */ import_react14.default.createElement(MarketPage, { sessionId: sessionId || mainSessionId, workspaceId, runCommand });
}
function HubPage(props) {
  const useSessions = props?.useSessions;
  if (typeof useSessions !== "function") {
    return /* @__PURE__ */ import_react14.default.createElement(MarketPage, { sessionId: props?.sessionId, runCommand });
  }
  return /* @__PURE__ */ import_react14.default.createElement(HubPageWithSessions, { useSessions, useWorkspaces: props?.useWorkspaces, sessionId: props?.sessionId });
}
var SIDEBAR_ENTRIES = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "menuExpert" },
  { id: "skill", label: "\u6280\u80FD", icon: "menuSkill" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "menuConnector" }
];
function PanelIcon() {
  const [anchor, setAnchor] = (0, import_react14.useState)(null);
  const ref = (0, import_react14.useRef)(null);
  const open = () => {
    const host = ref.current?.closest?.("button") || ref.current;
    const rect = host?.getBoundingClientRect?.();
    if (rect) setAnchor({ top: Math.round(rect.top), left: Math.round(rect.right - 12) });
  };
  (0, import_react14.useEffect)(() => {
    const host = ref.current?.closest?.("button") || ref.current;
    if (!host) return void 0;
    const onEnter = () => open();
    const onLeave = (event) => {
      const pop = ref.current?.querySelector?.(".wbh-sideEntryPop");
      if (pop && event.relatedTarget && pop.contains(event.relatedTarget)) return;
      setAnchor(null);
    };
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);
    return () => {
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return /* @__PURE__ */ import_react14.default.createElement("span", { className: "wbh-sideEntry", ref }, /* @__PURE__ */ import_react14.default.createElement(PickIcon, { name: "menuExpert", size: 16 }), anchor && /* @__PURE__ */ import_react14.default.createElement("span", { className: "wbh-sideEntryPop", style: { top: `${anchor.top}px`, left: `${anchor.left}px` } }, /* @__PURE__ */ import_react14.default.createElement("span", { className: "wbh-sideEntryList", role: "menu", "aria-label": "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668" }, SIDEBAR_ENTRIES.map((item) => /* @__PURE__ */ import_react14.default.createElement(
    "span",
    {
      key: item.id,
      className: "wbh-sideEntryItem",
      role: "menuitem",
      tabIndex: 0,
      onClick: () => {
        setAnchor(null);
        openMarket({ kind: item.id, view: "market" });
      },
      onKeyDown: (event) => {
        if (event.key !== "Enter") return;
        setAnchor(null);
        openMarket({ kind: item.id, view: "market" });
      }
    },
    /* @__PURE__ */ import_react14.default.createElement("span", { className: "wbh-sideEntryIcon" }, /* @__PURE__ */ import_react14.default.createElement(PickIcon, { name: item.icon, size: 16 })),
    /* @__PURE__ */ import_react14.default.createElement("span", { className: "wbh-sideEntryLabel" }, item.label)
  )))));
}
function ComposerSlotWithSessions({ useSessions, sessionId }) {
  const blank = useSessions((state) => state?.byId?.[sessionId]?.blank);
  return /* @__PURE__ */ import_react14.default.createElement(ComposerAdd, { sessionId, runCommand, sessionBlank: blank });
}
function ComposerSlot(props) {
  const useSessions = props?.useSessions;
  if (typeof useSessions !== "function") {
    return /* @__PURE__ */ import_react14.default.createElement(ComposerAdd, { sessionId: props?.sessionId, runCommand });
  }
  return /* @__PURE__ */ import_react14.default.createElement(ComposerSlotWithSessions, { useSessions, sessionId: props?.sessionId });
}
var plugin = {
  apply(ctx) {
    pluginCtx = ctx;
    const reg = (name, options, component) => ctx.slots.register(options, component);
    setMarketNavigator(() => {
      let layout = null;
      try {
        layout = ctx.get?.("layout") ?? null;
      } catch {
        layout = null;
      }
      const ok = typeof layout?.selectPanel === "function";
      try {
        if (ok) layout.selectPanel("workbuddy-hub");
      } catch (error) {
        console.warn("[wbh] selectPanel failed:", String(error?.message || error));
      }
      console.info("[wbh] openMarket -> layout:", Boolean(layout), "selectPanel:", ok);
    });
    setSessionOpener((sessionId) => {
      if (!sessionId) return false;
      let workspace = null;
      try {
        workspace = ctx.get?.("uiWorkspace") ?? null;
      } catch {
        workspace = null;
      }
      const ok = typeof workspace?.openSession === "function";
      console.info("[wbh] openSession ->", sessionId, "uiWorkspace:", Boolean(workspace), "openSession:", ok);
      if (!ok) return false;
      try {
        workspace.openSession({ sessionId });
        return true;
      } catch (error) {
        console.warn("[wbh] openSession failed:", String(error?.message || error));
        return false;
      }
    });
    setPresetSelector((sessionId, presetId) => {
      const remote = ctx.remote ?? null;
      if (typeof remote?.agentPresets?.select !== "function") {
        return { ok: false, error: "agentPresets remote \u4E0D\u53EF\u7528" };
      }
      return remote.agentPresets.select(sessionId, presetId);
    });
    setSessionStarter(() => {
      let workspace = null;
      try {
        workspace = ctx.get?.("uiWorkspace") ?? null;
      } catch {
        workspace = null;
      }
      const ok = typeof workspace?.startSession === "function";
      console.info("[wbh] startSession -> uiWorkspace:", Boolean(workspace), "startSession:", ok);
      if (!ok) return false;
      try {
        workspace.startSession();
        return true;
      } catch (error) {
        console.warn("[wbh] startSession failed:", String(error?.message || error));
        return false;
      }
    });
    try {
      window.__wbh = { openSessionById, startNewSession, composerSession, summonExpertInNewSession };
    } catch {
    }
    ctx.slots.inject("main", () => reg("main", { name: "main", key: "workbuddy-hub" }, HubPage));
    ctx.slots.inject("sidebar.panellist", () => reg("sidebar.panellist", { name: "sidebar.panellist", id: "workbuddy-hub", order: -90, label: () => "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668" }, PanelIcon));
    ctx.slots.inject("conversation.input.left", () => reg("conversation.input.left", {
      name: "conversation.input.left",
      id: "workbuddy-hub-add",
      order: -90,
      label: () => "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668"
    }, ComposerSlot));
    ctx.slots.inject("conversation.composer.dock", () => reg("conversation.composer.dock", {
      name: "conversation.composer.dock",
      id: "workbuddy-hub-idle",
      order: 60
    }, IdleSlot));
    ctx.slots.inject("settings.section", () => reg("settings.section", {
      name: "settings.section",
      id: "workbuddy-hub",
      order: 85,
      label: () => "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668"
    }, SettingsPage));
    ctx.slots.inject("settings.plugins.tab", () => reg("settings.plugins.tab", {
      name: "settings.plugins.tab",
      id: "workbuddy-hub",
      order: 80,
      label: () => "WorkBuddy \u5E02\u573A"
    }, SettingsPage));
  }
};
plugin.inject = ["slots", "remote", "remote.agentPresets"];
module.exports = plugin;

return module.exports; } });
