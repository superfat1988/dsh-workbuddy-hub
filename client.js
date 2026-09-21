window.__ModuleLoader__.load({ id: 'dsh-workbuddy-hub', factory: function (require) { const module = { exports: {} };
var __wbCss = "/* src/official-skill.css */\n.skill-card {\n  display: flex;\n  flex-direction: column;\n  padding: 16px 20px;\n  border-radius: 16px;\n  border: 1px solid var(--wb-border-card-static);\n  background: var(--wb-bg-card);\n  box-shadow: var(--wb-shadow-card-soft);\n  transition:\n    background .2s ease,\n    box-shadow .2s ease,\n    border-color .2s ease;\n  cursor: pointer;\n  min-height: 84px;\n  max-height: fit-content;\n  min-width: 0;\n  position: relative;\n  overflow: visible;\n}\n.skill-card:hover {\n  background: var(--wb-bg-card-hover);\n  box-shadow: var(--wb-shadow-card-soft);\n  border-color: #00000014;\n}\n.skill-card--disabled .skill-card-icon {\n  opacity: .35;\n}\n.skill-card--disabled .skill-card-name {\n  color: var(--wb-color-text-secondary);\n  opacity: .55;\n}\n.skill-card--disabled .skill-card-desc {\n  color: var(--wb-color-text-tertiary);\n  opacity: .55;\n}\n.skill-card--disabled .skill-card-meta {\n  opacity: .55;\n}\n.skill-card--batch-mode {\n  cursor: pointer;\n  padding-left: 34px;\n}\n.skill-card--batch-mode .skill-card-body {\n  cursor: pointer;\n}\n.skill-card--batch-mode .skill-checkbox {\n  pointer-events: none;\n}\n.skill-card-content {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  flex: 1;\n  gap: 12px;\n  min-width: 0;\n}\n.skill-card-badge {\n  flex-shrink: 0;\n  font-size: 10px;\n  font-weight: 600;\n  padding: 2px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  line-height: 1.3;\n}\n.skill-card-badge--plugin {\n  background: color-mix(in srgb, var(--wb-accent-purple) 20%, transparent);\n  color: var(--wb-accent-purple);\n}\n.skill-card-name-status-icon {\n  display: inline-flex;\n  align-items: center;\n  margin-left: 4px;\n}\n.skill-card-name-status-icon--api-key {\n  color: currentColor;\n}\n.skill-card-feature-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin-top: 6px;\n}\n.skill-card-feature-tag {\n  font-size: 10px;\n  font-weight: 500;\n  padding: 2px 6px;\n  border-radius: 3px;\n  background: color-mix(in srgb, var(--wb-border-subtle) 40%, transparent);\n  color: var(--wb-color-text-tertiary);\n  white-space: nowrap;\n}\n.skill-card-feature-tag--skills {\n  background: color-mix(in srgb, var(--wb-status-success) 15%, transparent);\n  color: var(--wb-status-success);\n}\n.skill-card-feature-tag--commands {\n  background: color-mix(in srgb, var(--wb-accent-blue) 15%, transparent);\n  color: var(--wb-accent-blue);\n}\n.skill-card-feature-tag--mcp {\n  background: color-mix(in srgb, var(--wb-status-warning) 15%, transparent);\n  color: var(--wb-status-warning);\n}\n.skill-card-feature-tag--agents {\n  background: color-mix(in srgb, var(--wb-accent-pink) 15%, transparent);\n  color: var(--wb-accent-pink);\n}\n.skill-card-feature-tag--hooks {\n  background: color-mix(in srgb, var(--wb-accent-purple) 15%, transparent);\n  color: var(--wb-accent-purple);\n}\n.skill-card-feature-tag--rules {\n  background: color-mix(in srgb, var(--wb-accent-teal) 15%, transparent);\n  color: var(--wb-accent-teal);\n}\n.skill-card-main-row {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.skill-card-icon {\n  width: 28px;\n  height: 28px;\n  border-radius: 28px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--wb-color-text-secondary);\n  flex-shrink: 0;\n  overflow: hidden;\n}\n.skill-card-icon img {\n  width: 28px;\n  height: 28px;\n  border-radius: 28px;\n}\n.skill-card-body {\n  flex: 1;\n  min-width: 0;\n  cursor: pointer;\n}\n.skill-card-name-row {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  flex-wrap: nowrap;\n  width: 100%;\n  margin-bottom: 2px;\n}\n.skill-card-name {\n  font-size: 14.5px;\n  font-weight: 650;\n  letter-spacing: -.01em;\n  color: var(--wb-color-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  flex: 1 1 auto;\n  line-height: 1.4;\n}\n.skill-card-source {\n  flex-shrink: 0;\n  font-size: 11px;\n  font-weight: 500;\n  color: var(--wb-color-text-secondary);\n  background: var(--wb-bg-hover);\n  padding: 1px 6px;\n  border-radius: 4px;\n  white-space: nowrap;\n  line-height: 1.4;\n}\n.skill-card-desc {\n  margin-top: 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.6;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: normal;\n  min-height: 38px;\n  align-self: stretch;\n}\n.skill-card-desc--two-lines {\n  -webkit-line-clamp: 2;\n}\n.skill-card-stats {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 4px;\n}\n.skill-card-stat {\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  font-size: 11px;\n  color: var(--wb-color-text-secondary);\n}\n.skill-card-stat svg {\n  opacity: .7;\n}\n.skill-card-installed-check {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  color: var(--wb-text-weak);\n  flex-shrink: 0;\n}\n.skill-card-installed-check svg {\n  width: 14px;\n  height: 14px;\n  stroke-width: 2.5;\n}\nbutton.skill-card-installed-check {\n  background: transparent;\n  border: 0;\n  padding: 0;\n  cursor: pointer;\n  position: relative;\n}\nbutton.skill-card-installed-check:hover {\n  color: var(--wb-color-text-primary);\n}\nbutton.skill-card-installed-check:focus-visible {\n  outline: 2px solid var(--wb-border-focus);\n  outline-offset: 1px;\n  border-radius: 4px;\n}\n.skill-card-installed-check__default,\n.skill-card-installed-check__hover {\n  position: absolute;\n  inset: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity .12s ease;\n  pointer-events: none;\n}\n.skill-card-installed-check__default {\n  opacity: 1;\n}\n.skill-card-installed-check__hover,\nbutton.skill-card-installed-check:hover .skill-card-installed-check__default {\n  opacity: 0;\n}\nbutton.skill-card-installed-check:hover .skill-card-installed-check__hover {\n  opacity: 1;\n}\n.skill-card:has(.skill-card-menu) {\n  z-index: 50;\n}\n.skill-card:has(.skill-card-menu) .skill-status {\n  z-index: 60;\n}\n.skill-card-menu-wrap {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.skill-card--installed-list-mode .skill-card-pin,\n.skill-card--installed-list-mode .skill-card-menu-wrap {\n  opacity: 0;\n  width: 0;\n  min-width: 0;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  pointer-events: none;\n  transition: opacity .12s ease, width .12s ease;\n}\n.skill-card--installed-list-mode:hover .skill-card-pin,\n.skill-card--installed-list-mode:hover .skill-card-menu-wrap {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n  overflow: visible;\n}\n.skill-card--installed-list-mode .skill-card-pin.skill-card-pin--active {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n}\n.skill-card--installed-list-mode .skill-card-menu-wrap:has(.skill-card-menu) {\n  opacity: 1;\n  width: 22px;\n  min-width: 22px;\n  padding: initial;\n  pointer-events: auto;\n  overflow: visible;\n}\n.skill-card-pin {\n  width: 22px;\n  height: 22px;\n  padding: 0;\n  border: none;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--wb-text-weak);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition:\n    background-color .15s ease,\n    color .15s ease,\n    opacity .12s ease;\n}\n.skill-card-pin svg {\n  width: 14px;\n  height: 14px;\n}\n.skill-card-pin:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-card-pin:focus-visible {\n  outline: 2px solid var(--wb-border-focus);\n  outline-offset: 1px;\n}\n.skill-card-pin--active {\n  color: var(--wb-color-text-primary);\n}\n.skill-card-switch-wrap {\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  line-height: 0;\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__track {\n  width: 26px;\n  height: 16px;\n  padding: 0;\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__thumb {\n  width: 12px;\n  height: 12px;\n  top: 2px;\n  left: 2px;\n  background: var(--wb-text-on-primary);\n}\n.skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__thumb {\n  transform: translate(10px);\n}\n.skill-card-switch-wrap .cb-switch--small .cb-switch__icon {\n  width: 10px;\n  height: 10px;\n}\nbody.vscode-dark .skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__track,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card-switch-wrap .cb-switch--small.cb-switch--checked .cb-switch__track {\n  background: var(--wb-brand-primary-deep);\n}\n.skill-card-menu-btn {\n  width: 22px;\n  height: 22px;\n  border-radius: 5px;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color .15s, color .15s;\n}\n.skill-card-menu-btn:hover,\n.skill-card-menu-btn.is-open {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-card-menu-btn svg {\n  width: 14px;\n  height: 14px;\n}\n.skill-card-menu {\n  position: absolute;\n  top: calc(100% + 4px);\n  right: 0;\n  min-width: 108px;\n  padding: 4px;\n  background: var(--wb-bg-popover);\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  box-shadow: 0 8px 24px var(--wb-border-default);\n  z-index: 100;\n}\n.skill-card-menu-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  border-radius: 6px;\n  cursor: pointer;\n  line-height: 1.2;\n  white-space: nowrap;\n  transition: background .1s;\n}\n.skill-card-menu-item svg {\n  width: 13px;\n  height: 13px;\n  flex-shrink: 0;\n}\n.skill-card-menu-item:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skill-add-btn {\n  flex-shrink: 0;\n  margin-left: 8px;\n  align-self: flex-start;\n  margin-top: 2px;\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  border: none;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background .15s, color .15s;\n  padding: 0;\n}\n.skill-add-btn svg {\n  width: 14px;\n  height: 14px;\n  stroke-width: 2;\n}\n.skill-add-btn:hover {\n  background: var(--wb-border-default);\n}\n.skill-add-btn--loading {\n  pointer-events: none;\n}\nbody.vscode-light .skill-add-btn,\nbody[data-vscode-theme-kind=vscode-light] .skill-add-btn {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\nbody.vscode-light .skill-add-btn:hover,\nbody[data-vscode-theme-kind=vscode-light] .skill-add-btn:hover {\n  background: var(--wb-bg-hover);\n}\n.skill-card:hover .skill-install-float {\n  opacity: 1;\n  transform: translateY(0);\n}\n.skill-card:hover .skill-install-float--try-now {\n  opacity: 1;\n  transform: translateY(0);\n}\n.skill-card-top {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n  gap: 0;\n}\n.skill-card-reason {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n  line-height: 2;\n  font-weight: 600;\n  letter-spacing: .01em;\n  padding: 0 8px 0 10px;\n  background: var(--wb-brand-primary-subtle);\n  border: none;\n  border-radius: 16px 0 8px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: calc(100% - 24px);\n  color: var(--wb-brand-primary-deep);\n}\n.skill-card-reason:before {\n  content: \"\";\n  width: 12px;\n  height: 12px;\n  flex-shrink: 0;\n  background-color: currentColor;\n  mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path transform='matrix(1 0 0 1 0.999974 0.5)' d='M0 5.7L0 5.6727Q0 4.8316 0.0412 4.5297Q0.119 3.9597 0.4394 3.6393Q0.7597 3.319 1.3298 3.2412Q1.6316 3.2 2.4727 3.2L2.6535 3.2L3.4226 1.1492Q3.617 0.6307 4.0721 0.3154Q4.5272 0 5.0808 0Q5.8722 0 6.4001 0.5895Q6.9281 1.179 6.8412 1.9655L6.7045 3.2023Q7.3412 3.2083 7.6128 3.2295Q8.2529 3.2794 8.6392 3.4806Q9.6283 3.9957 9.9078 5.0753Q10.0169 5.4969 9.9217 6.1319Q9.8653 6.5073 9.6207 7.5672L9.6207 7.5673L9.5686 7.7932Q9.2248 9.2828 8.9033 9.7078Q8.5159 10.2199 7.9297 10.4823Q7.4433 10.7 5.9146 10.7L2.4727 10.7Q1.6316 10.7 1.3298 10.6588Q0.7597 10.581 0.4394 10.2606Q0.119 9.9403 0.0412 9.3703Q0 9.0684 0 8.2273L0 5.7ZM1 5.7L1 8.2273Q1 9.4071 1.1465 9.5536Q1.2884 9.6955 2.3999 9.6999L2.3999 4.2002Q1.2884 4.2045 1.1465 4.3464Q1 4.4929 1 5.6727L1 5.7ZM3.3999 4.0029L3.3999 9.7L5.9146 9.7Q7.2298 9.7 7.5211 9.5696Q7.8732 9.412 8.1059 9.1044Q8.2985 8.8498 8.5942 7.5683L8.6463 7.3424L8.6463 7.3424Q9.0306 5.6771 8.9397 5.3259Q8.7718 4.6771 8.1774 4.3676Q7.8555 4.2 6.1465 4.2Q5.9369 4.206 5.793 4.0535Q5.6405 3.9095 5.6465 3.6999Q5.6465 3.6862 5.6473 3.6725Q5.648 3.6587 5.6495 3.645L5.8472 1.8557Q5.885 1.5133 5.6552 1.2566Q5.4254 1 5.0808 1Q4.5465 1 4.3589 1.5003L3.4682 3.8755Q3.4428 3.946 3.3999 4.0029Z' fill-rule='evenodd' fill='black'/></svg>\");\n  -webkit-mask-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path transform='matrix(1 0 0 1 0.999974 0.5)' d='M0 5.7L0 5.6727Q0 4.8316 0.0412 4.5297Q0.119 3.9597 0.4394 3.6393Q0.7597 3.319 1.3298 3.2412Q1.6316 3.2 2.4727 3.2L2.6535 3.2L3.4226 1.1492Q3.617 0.6307 4.0721 0.3154Q4.5272 0 5.0808 0Q5.8722 0 6.4001 0.5895Q6.9281 1.179 6.8412 1.9655L6.7045 3.2023Q7.3412 3.2083 7.6128 3.2295Q8.2529 3.2794 8.6392 3.4806Q9.6283 3.9957 9.9078 5.0753Q10.0169 5.4969 9.9217 6.1319Q9.8653 6.5073 9.6207 7.5672L9.6207 7.5673L9.5686 7.7932Q9.2248 9.2828 8.9033 9.7078Q8.5159 10.2199 7.9297 10.4823Q7.4433 10.7 5.9146 10.7L2.4727 10.7Q1.6316 10.7 1.3298 10.6588Q0.7597 10.581 0.4394 10.2606Q0.119 9.9403 0.0412 9.3703Q0 9.0684 0 8.2273L0 5.7ZM1 5.7L1 8.2273Q1 9.4071 1.1465 9.5536Q1.2884 9.6955 2.3999 9.6999L2.3999 4.2002Q1.2884 4.2045 1.1465 4.3464Q1 4.4929 1 5.6727L1 5.7ZM3.3999 4.0029L3.3999 9.7L5.9146 9.7Q7.2298 9.7 7.5211 9.5696Q7.8732 9.412 8.1059 9.1044Q8.2985 8.8498 8.5942 7.5683L8.6463 7.3424L8.6463 7.3424Q9.0306 5.6771 8.9397 5.3259Q8.7718 4.6771 8.1774 4.3676Q7.8555 4.2 6.1465 4.2Q5.9369 4.206 5.793 4.0535Q5.6405 3.9095 5.6465 3.6999Q5.6465 3.6862 5.6473 3.6725Q5.648 3.6587 5.6495 3.645L5.8472 1.8557Q5.885 1.5133 5.6552 1.2566Q5.4254 1 5.0808 1Q4.5465 1 4.3589 1.5003L3.4682 3.8755Q3.4428 3.946 3.3999 4.0029Z' fill-rule='evenodd' fill='black'/></svg>\");\n  mask-repeat: no-repeat;\n  -webkit-mask-repeat: no-repeat;\n  mask-size: contain;\n  -webkit-mask-size: contain;\n}\nbody.vscode-dark .skill-card-reason,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card-reason {\n  background: color-mix(in srgb, var(--wb-brand-primary) 18%, transparent);\n  color: var(--wb-brand-primary);\n}\n.skill-card:hover .skill-install-btn {\n  opacity: 1;\n  visibility: visible;\n  pointer-events: auto;\n}\n.skills-featured-section .skill-card {\n  min-height: 109px;\n}\n.skills-featured-section--has-reasons .skill-card {\n  padding: 36px 20px 16px;\n}\n.skill-card--skeleton {\n  cursor: default;\n  pointer-events: none;\n}\n.skill-card--skeleton .skill-card-skeleton-block {\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\n.skill-card-skeleton-line {\n  height: 12px;\n  border-radius: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\n.skill-card-skeleton-line--name {\n  width: 60%;\n  height: 14px;\n}\n.skill-card-skeleton-line--desc {\n  width: 90%;\n  margin-top: 6px;\n}\n.skill-card-skeleton-toggle {\n  width: 38px;\n  height: 22px;\n  border-radius: 999px;\n  flex-shrink: 0;\n  background:\n    linear-gradient(\n      90deg,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 25%,\n      var(--wb-bg-hover) 50%,\n      color-mix(in srgb, var(--wb-border-subtle) 50%, transparent) 75%);\n  background-size: 200% 100%;\n  animation: skill-skeleton-shimmer 1.5s ease-in-out infinite;\n}\nbody.vscode-dark .skill-card:hover,\nbody[data-vscode-theme-kind=vscode-dark] .skill-card:hover {\n  background: var(--wb-color-bg-card-hover);\n  border-color: var(--wb-border-subtle);\n}\n:root.theme-switching .skill-card,\nbody.theme-switching .skill-card {\n  transition: none;\n}\n.category-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 28px;\n  padding: 4px 12px;\n  border-radius: 6px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all .12s;\n}\n.category-chip:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.category-chip--active {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  font-weight: 500;\n}\n.category-chip--active:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.category-chip-label {\n  flex: 1;\n}\n.category-chip-loading {\n  width: 12px;\n  height: 12px;\n  border: 2px solid var(--wb-color-text-tertiary);\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: category-chip-spin .8s linear infinite;\n}\n.category-chip-more {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.category-chip-more-btn {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  margin-left: 2px;\n  margin-right: -4px;\n  border-radius: 4px;\n  color: var(--wb-color-text-tertiary);\n  transition: background .15s ease, color .15s ease;\n}\n.category-chip-more-btn:hover {\n  background: var(--wb-bg-hover-light);\n  color: var(--wb-color-text-primary);\n}\n.category-chip-more-btn svg {\n  width: 14px;\n  height: 14px;\n}\n.category-chip-dropdown {\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 50%;\n  transform: translate(-50%);\n  min-width: 100px;\n  padding: 4px;\n  background: var(--wb-bg-popover);\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  box-shadow: var(--wb-shadow-dialog-md);\n  z-index: 1000;\n}\n.category-chip-dropdown-item {\n  padding: 6px 10px;\n  font-size: 12px;\n  color: var(--wb-color-text-primary);\n  border-radius: 4px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n.category-chip-dropdown-item:hover {\n  background: var(--wb-bg-hover);\n}\n.category-chip-dropdown-item--danger {\n  color: var(--wb-error-foreground);\n}\n.category-chip-dropdown-item--danger:hover {\n  background: color-mix(in srgb, var(--wb-error-foreground) 10%, transparent);\n}\n.skills-view {\n  position: relative;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary);\n}\n.skills-view .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.skills-view .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n.skills-view .ec-subpage-title {\n  margin: 0;\n  padding: 12px 20px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.skills-view--detail {\n  overflow: hidden;\n}\n.skills-view--detail .skill-detail-view,\n.skills-view--detail .cb-plugin-detail {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n}\n.skills-view--detail .skill-detail-back,\n.skills-view--detail .cb-plugin-detail-back {\n  display: none !important;\n}\n.skills-view-header {\n  padding: 7px 24px 16px;\n  flex-shrink: 0;\n}\n.skills-view-header h2 {\n  margin: 0;\n  font-size: 18px;\n  line-height: 1.33;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.skills-view-header p {\n  margin: 4px 0 0;\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.5;\n}\n.skills-view-header-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  flex-wrap: wrap;\n  gap: 14px;\n}\n.skills-segment-bar {\n  display: flex;\n  align-items: center;\n  padding: 16px 0 12px;\n  gap: 16px;\n}\n.skills-segment-group {\n  display: inline-flex;\n  background: transparent;\n  border-radius: 0;\n  padding: 0;\n  gap: 20px;\n}\n.skills-segment-item {\n  padding: 0 0 4px;\n  font-size: 20px;\n  line-height: 1.4;\n  color: var(--wb-color-text-tertiary);\n  cursor: pointer;\n  border-radius: 0;\n  border: none;\n  background: transparent;\n  transition: color .12s ease;\n  font-weight: 600;\n  white-space: nowrap;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.skills-segment-item:hover {\n  color: var(--wb-color-text-secondary);\n  background: transparent;\n}\n.skills-segment-item--active {\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  box-shadow: none;\n}\n.skills-segment-item--active:hover {\n  background: transparent;\n  color: var(--wb-color-text-primary);\n}\n.skills-segment-item .skills-segment-badge-new {\n  position: absolute;\n  top: -2px;\n  right: -8px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--wb-status-error);\n  pointer-events: none;\n}\n.skills-content {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 24px 20px;\n  scrollbar-width: thin;\n}\n.skills-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));\n  gap: 12px;\n}\n.skills-featured-section {\n  padding-bottom: 20px;\n}\n.skills-featured-section .skill-card {\n  min-height: 109px;\n}\n.skills-featured-section--has-reasons .skill-card {\n  padding: 36px 20px 16px;\n}\n.skills-featured-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n.skills-featured-title {\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.4;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--wb-color-text-primary);\n}\nbody.vscode-dark .skills-featured-title,\nbody[data-vscode-theme-kind=vscode-dark] .skills-featured-title {\n  color: var(--wb-color-text-primary);\n}\n.skills-featured-refresh-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 4px 8px;\n  height: 24px;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--wb-color-text-tertiary);\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: color .12s ease, background-color .12s ease;\n  font-family: inherit;\n}\n.skills-featured-refresh-btn:hover {\n  color: var(--wb-color-text-primary);\n  background: var(--wb-bg-hover);\n}\n.skills-featured-refresh-btn:hover svg {\n  transform: rotate(90deg);\n}\n.skills-featured-refresh-btn:active {\n  opacity: .7;\n}\n.skills-featured-refresh-btn svg {\n  width: 13px;\n  height: 13px;\n  color: currentColor;\n  transition: transform .45s cubic-bezier(.4, 0, .2, 1);\n}\n.skillhub-category-chip {\n  height: 28px;\n  padding: 4px 12px;\n  border-radius: 6px;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: all .12s;\n}\n.skillhub-category-chip:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.skillhub-category-chip--active {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n  font-weight: 500;\n}\n.skillhub-category-chip--active:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.plugins-section .skills-grid {\n  min-height: 200px;\n}\n\n/* src/official-connector.css */\n.connector-card {\n  display: grid;\n  grid-template-columns: 40px minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  row-gap: 8px;\n  align-items: start;\n  align-content: start;\n  min-height: 88px;\n  padding: 14px 16px;\n  border: 1px solid var(--wb-border-card-static);\n  border-radius: 16px;\n  background: var(--wb-bg-card);\n  box-shadow: var(--wb-shadow-card-soft);\n  transition: all .25s cubic-bezier(.4, 0, .2, 1);\n  cursor: pointer;\n}\n.connector-card:hover {\n  border-color: var(--wb-border-default);\n  background: var(--wb-bg-card-hover);\n  box-shadow: var(--wb-shadow-card-soft);\n}\n.connector-card--skeleton {\n  pointer-events: none;\n  cursor: default;\n}\n.connector-card--incompatible {\n  opacity: .55;\n}\n.connector-card--incompatible:hover {\n  border-color: var(--wb-border-default);\n  background: var(--wb-bg-card);\n  transform: none;\n  box-shadow: none;\n}\n.connector-card-icon {\n  grid-column: 1;\n  grid-row: 1;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--wb-color-text-primary);\n  font-size: 16px;\n  font-weight: 600;\n  overflow: hidden;\n}\n.connector-card-main {\n  display: contents;\n}\n.connector-card-name-row {\n  grid-column: 2;\n  grid-row: 1;\n  align-self: center;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n}\n.connector-card-name {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.connector-card-status-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  background: var(--wb-status-success);\n}\n.connector-card-status-dot--connected {\n  background: var(--wb-status-success);\n}\n.connector-card-status-dot--connecting {\n  background: var(--wb-status-warning);\n  animation: connector-status-pulse 1.2s ease-in-out infinite;\n}\n.connector-card-status-dot--error {\n  background: var(--wb-status-error);\n}\n.connector-card-badge {\n  padding: 2px 8px;\n  border-radius: 6px;\n  font-size: 11px;\n  line-height: 1.4;\n  color: var(--wb-color-text-secondary);\n  background: var(--wb-bg-hover);\n  white-space: nowrap;\n}\n.connector-card-desc {\n  grid-column: 1 / -1;\n  grid-row: 2;\n  margin-top: 2px;\n  font-size: 11px;\n  line-height: 18px;\n  color: var(--wb-color-text-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.connector-card-action {\n  grid-column: 3;\n  grid-row: 1;\n  align-self: start;\n  display: inline-flex;\n  align-items: center;\n  margin-top: 4px;\n  margin-right: 4px;\n}\n:root.theme-switching .connector-card,\nbody.theme-switching .connector-card,\n:root.theme-switching .connector-connect-btn,\nbody.theme-switching .connector-connect-btn,\n:root.theme-switching .connector-detail-tool-item,\nbody.theme-switching .connector-detail-tool-item {\n  transition: none;\n}\n\n/* src/official-skeleton.css */\n.wb-card__skeleton {\n  display: flex;\n  flex-direction: column;\n  gap: var(--wb-spacing-3);\n}\n.wb-card__skeleton-row {\n  height: 12px;\n  border-radius: var(--wb-radius-sm);\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n@keyframes wb-card-skeleton-shimmer {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n.wbh-skelCard {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px 20px;\n  border-radius: 16px;\n  border: 1px solid var(--wb-border-card-static,#eee);\n  background: var(--wb-bg-card,#fff);\n  min-height: 120px;\n}\n.wbh-skelHead {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.wbh-skelAvatar {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  flex-shrink: 0;\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n.wbh-skelLines {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.wbh-skelRow {\n  height: 12px;\n  border-radius: var(--wb-radius-sm,4px);\n  background:\n    linear-gradient(\n      90deg,\n      var(--wb-bg-tertiary) 0%,\n      var(--wb-bg-primary) 50%,\n      var(--wb-bg-tertiary) 100%);\n  background-size: 200% 100%;\n  animation: wb-card-skeleton-shimmer 1.4s ease-in-out infinite;\n}\n.wbh-skelRow.short {\n  width: 60%;\n}\n\n/* src/official.css */\n:root {\n  --wb-palette-black-10: rgba(0, 0, 0, .1);\n  --wb-palette-black-20: rgba(0, 0, 0, .2);\n  --wb-palette-black-30: rgba(0, 0, 0, .3);\n  --wb-palette-black-40: rgba(0, 0, 0, .4);\n  --wb-palette-black-50: rgba(0, 0, 0, .5);\n  --wb-palette-black-60: rgba(0, 0, 0, .6);\n  --wb-palette-black-70: rgba(0, 0, 0, .7);\n  --wb-palette-black-75: rgba(0, 0, 0, .75);\n  --wb-palette-black-90: rgba(0, 0, 0, .9);\n  --wb-palette-black-100: #000000;\n  --wb-palette-white-10: rgba(255, 255, 255, .1);\n  --wb-palette-white-20: rgba(255, 255, 255, .2);\n  --wb-palette-white-30: rgba(255, 255, 255, .3);\n  --wb-palette-white-40: rgba(255, 255, 255, .4);\n  --wb-palette-white-50: rgba(255, 255, 255, .5);\n  --wb-palette-white-60: rgba(255, 255, 255, .6);\n  --wb-palette-white-70: rgba(255, 255, 255, .7);\n  --wb-palette-white-75: rgba(255, 255, 255, .75);\n  --wb-palette-white-80: rgba(255, 255, 255, .8);\n  --wb-palette-white-90: rgba(255, 255, 255, .9);\n  --wb-palette-white-100: #FFFFFF;\n  --wb-palette-brand-1: #DFF7F2;\n  --wb-palette-brand-2: #BFF0E6;\n  --wb-palette-brand-3: #9FE8D9;\n  --wb-palette-brand-4: #80E1CD;\n  --wb-palette-brand-5: #60D9C0;\n  --wb-palette-brand-7: #40D1B3;\n  --wb-palette-brand-8: #00C29A;\n  --wb-palette-brand-9: #009273;\n  --wb-palette-brand-10: #00614D;\n  --wb-palette-gray-1: #FAFAFA;\n  --wb-palette-gray-2: #F7F7F7;\n  --wb-palette-gray-3: #F2F2F2;\n  --wb-palette-gray-4: #EBEBEB;\n  --wb-palette-gray-5: #E6E6E6;\n  --wb-palette-green-1: #E7F8F0;\n  --wb-palette-green-2: #C2EFD6;\n  --wb-palette-green-3: #A3E7C2;\n  --wb-palette-green-4: #85DFAD;\n  --wb-palette-green-5: #66D799;\n  --wb-palette-green-6: #47CF84;\n  --wb-palette-green-7: #29C770;\n  --wb-palette-green-8: #0CBF5B;\n  --wb-palette-green-9: #088F50;\n  --wb-palette-orange-1: #FFEDDF;\n  --wb-palette-orange-2: #FFDCBF;\n  --wb-palette-orange-3: #FFCA9F;\n  --wb-palette-orange-4: #FFB980;\n  --wb-palette-orange-5: #FFA760;\n  --wb-palette-orange-6: #FF9540;\n  --wb-palette-orange-7: #FF8420;\n  --wb-palette-orange-8: #FF7800;\n  --wb-palette-orange-9: #C04100;\n  --wb-palette-orange-10: #800F00;\n  --wb-palette-red-1: #FCE8E8;\n  --wb-palette-red-2: #F9D1D1;\n  --wb-palette-red-3: #F5B9B9;\n  --wb-palette-red-4: #F2A2A2;\n  --wb-palette-red-5: #EF8B8B;\n  --wb-palette-red-6: #EC7474;\n  --wb-palette-red-7: #E85C5C;\n  --wb-palette-red-8: #F64041;\n  --wb-palette-red-9: #B42C3F;\n  --wb-palette-red-10: #821238;\n  --wb-palette-blue-1: #EAF2FF;\n  --wb-palette-blue-2: #BFDBFE;\n  --wb-palette-blue-3: #93C5FD;\n  --wb-palette-blue-4: #60a5fa;\n  --wb-palette-blue-5: #4f86ff;\n  --wb-palette-blue-6: #4F7DF3;\n  --wb-palette-blue-7: #3370ff;\n  --wb-palette-blue-8: #2563eb;\n  --wb-palette-blue-9: #1565c0;\n  --wb-palette-blue-10: #0550ae;\n  --wb-palette-purple-1: #f5f2ff;\n  --wb-palette-purple-2: #F1EEFF;\n  --wb-palette-purple-3: #e0d4ff;\n  --wb-palette-purple-4: #c8a2ff;\n  --wb-palette-purple-5: #b0a0c8;\n  --wb-palette-purple-6: #7C5CFC;\n  --wb-palette-purple-7: #7B61FF;\n  --wb-palette-purple-8: #7c3aed;\n  --wb-palette-purple-9: #8250df;\n  --wb-palette-purple-10: #6C4DFF;\n  --wb-palette-cyan-1: #E8F7FF;\n  --wb-palette-cyan-2: #a6d5da;\n  --wb-palette-cyan-3: #6fc3df;\n  --wb-palette-cyan-4: #22D3EE;\n  --wb-palette-cyan-5: #06B6D4;\n  --wb-palette-cyan-6: #14b8a6;\n  --wb-palette-cyan-7: #00796b;\n  --wb-color-bg-primary-default: var(--wb-palette-gray-3);\n  --wb-color-bg-primary-hover: var(--wb-palette-gray-4);\n  --wb-color-bg-primary-active: var(--wb-palette-gray-5);\n  --wb-color-bg-primary-hover-strong: var(--wb-palette-gray-5);\n  --wb-color-bg-secondary-default: var(--wb-palette-white-100);\n  --wb-color-bg-secondary-hover-active: var(--wb-palette-gray-2);\n  --wb-color-border-primary: var(--wb-palette-gray-5);\n  --wb-color-border-secondary: var(--wb-palette-gray-4);\n  --wb-color-border-tertiary: var(--wb-palette-gray-3);\n  --wb-color-border-focus: var(--wb-palette-black-75);\n  --wb-color-mask-color: var(--wb-palette-black-60);\n  --wb-color-text-primary: var(--wb-palette-black-100);\n  --wb-color-text-secondary: var(--wb-palette-black-70);\n  --wb-color-text-tertiary: var(--wb-palette-black-50);\n  --wb-color-text-placeholder: var(--wb-palette-black-50);\n  --wb-color-text-disabled: var(--wb-palette-black-30);\n  --wb-color-text-hint: var(--wb-palette-black-30);\n  --wb-color-text-solid: var(--wb-palette-black-100);\n  --wb-color-text-brand-default: var(--wb-palette-brand-8);\n  --wb-color-text-brand-hover: var(--wb-palette-brand-7);\n  --wb-color-text-brand-focus: var(--wb-palette-brand-5);\n  --wb-color-text-brand-active: var(--wb-palette-brand-9);\n  --wb-color-text-brand-disabled: var(--wb-palette-brand-3);\n  --wb-color-accent-brand: var(--wb-palette-brand-8);\n  --wb-color-text-link-default: #1470B4;\n  --wb-color-text-link-hover: #0E58A0;\n  --wb-color-text-error-default: var(--wb-palette-red-8);\n  --wb-color-text-error-hover: var(--wb-palette-red-7);\n  --wb-color-text-error-focus: var(--wb-palette-red-5);\n  --wb-color-text-error-active: var(--wb-palette-red-9);\n  --wb-color-text-error-disabled: var(--wb-palette-red-3);\n  --wb-color-text-success-default: var(--wb-palette-green-8);\n  --wb-color-text-success-hover: var(--wb-palette-green-7);\n  --wb-color-text-success-focus: var(--wb-palette-green-5);\n  --wb-color-text-success-active: var(--wb-palette-green-9);\n  --wb-color-text-success-disabled: var(--wb-palette-green-3);\n  --wb-color-text-warning-default: var(--wb-palette-orange-8);\n  --wb-color-text-warning-hover: var(--wb-palette-orange-7);\n  --wb-brand-primary: var(--wb-palette-brand-8);\n  --wb-text-strong: var(--wb-color-text-primary);\n  --wb-text-medium: var(--wb-color-text-secondary);\n  --wb-text-weak: var(--wb-color-text-tertiary);\n  --wb-text-disable: var(--wb-color-text-disabled);\n  --wb-text-white: var(--wb-palette-white-100);\n  --wb-text-muted: var(--wb-color-text-disabled);\n  --wb-text-link: var(--wb-palette-brand-8);\n  --wb-text-on-primary: var(--wb-palette-white-100);\n  --wb-bg-primary: var(--wb-palette-white-100);\n  --wb-bg-secondary: var(--wb-color-bg-secondary-hover-active);\n  --wb-bg-tertiary: var(--wb-color-bg-primary-hover);\n  --wb-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 5%, transparent);\n  --wb-bg-hover-light: var(--wb-palette-gray-3);\n  --wb-bg-active: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-bg-overlay: var(--wb-palette-black-40);\n  --wb-color-bg-card-default: var(--wb-bg-hover-light);\n  --wb-color-bg-card-hover: var(--wb-color-bg-primary-hover-strong);\n  --wb-border-default: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-border-weak: color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent);\n  --wb-border-subtle: var(--wb-palette-gray-3);\n  --wb-border-strong: var(--wb-color-border-primary);\n  --wb-border-focus: var(--wb-color-border-focus);\n  --wb-control-selected-bg: var(--wb-palette-black-90);\n  --wb-control-selected-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-control-selected-fg: var(--wb-palette-white-100);\n  --wb-control-selected-bg-active: var(--wb-palette-black-100);\n  --wb-control-action-bg: var(--wb-palette-brand-5);\n  --wb-success: var(--wb-status-success);\n  --wb-warning: var(--wb-status-warning);\n  --wb-error: var(--wb-status-error);\n  --wb-info: var(--wb-status-info);\n  --wb-warning-soft: var(--wb-status-warning-soft);\n  --wb-error-foreground: var(--wb-status-error);\n  --wb-text-inverse: var(--wb-text-white);\n  --wb-bg-inverse: var(--wb-color-text-primary);\n  --wb-text-on-inverse: var(--wb-text-white);\n  --wb-icon-default: var(--wb-icon-primary);\n  --wb-home-bg-primary: #f2f2f2;\n  --wb-home-bg-secondary: #ffffff;\n  --wb-home-input-slot-bg:\n    linear-gradient(\n      180deg,\n      #f0f0f0 0%,\n      #f5f5f5 100%);\n  --wb-quick-action-sub-item-bg: #ebebeb;\n  --wb-bg-slate: #64748B;\n  --wb-bg-gold-start: #C2A979;\n  --wb-bg-gold-end: #8F6E30;\n  --wb-brand-primary-subtle: rgba(0, 194, 154, .12);\n  --wb-brand-primary-deep: #087866;\n  --wb-brand-accent: #1f1f1f;\n  --wb-brand-accent-bg: var(--wb-palette-purple-1);\n  --wb-brand-icon-bg: var(--wb-palette-green-1);\n  --wb-bg-card: var(--wb-palette-white-100);\n  --wb-bg-card-strong: #F5F5F5;\n  --wb-bg-item-selected: #f4f5f5;\n  --wb-bg-popover: var(--wb-palette-white-100);\n  --wb-bg-elevated: #3c3c3c;\n  --wb-bg-tab-active: #f1f3f6;\n  --wb-bg-success-soft: #e8f5e9;\n  --wb-bg-error-soft: #fef2f2;\n  --wb-bg-purple-soft: rgba(124, 58, 237, .12);\n  --wb-bg-content: var(--wb-palette-white-100);\n  --wb-bg-input-inset: transparent;\n  --wb-bg-tooltip: var(--wb-palette-black-90);\n  --wb-bg-tooltip-hover: var(--wb-palette-black-75);\n  --wb-bg-modal: var(--wb-palette-white-100);\n  --wb-bg-skeleton: rgba(128, 128, 128, .1);\n  --wb-border-card: rgba(0, 0, 0, .08);\n  --wb-border-card-static: #f2f2f2;\n  --wb-border-hover: rgba(0, 0, 0, .16);\n  --wb-border-action: var(--wb-palette-blue-7);\n  --wb-border-teams: var(--wb-palette-cyan-3);\n  --wb-border-popover: color-mix(in srgb, var(--wb-palette-black-100) 6%, transparent);\n  --wb-border-popover-strong: color-mix(in srgb, var(--wb-palette-black-100) 24%, transparent);\n  --wb-border-control: var(--wb-palette-gray-4);\n  --wb-border-input: var(--wb-palette-gray-3);\n  --wb-border-warning: #ffe1a8;\n  --wb-border-error: #fecdca;\n  --wb-bg-warning-subtle: #fff8e6;\n  --wb-border-warning-subtle: #ffe1a8;\n  --wb-bg-error-subtle: #fef3f2;\n  --wb-border-error-subtle: #fecdca;\n  --wb-brand-bright: #4ecba0;\n  --wb-brand-soft: #a8d9c5;\n  --wb-bg-action: var(--wb-palette-blue-8);\n  --wb-text-action: var(--wb-palette-blue-8);\n  --wb-bg-info: #EFF6FF;\n  --wb-border-info: var(--wb-palette-blue-2);\n  --wb-bg-focus-soft: rgba(26, 121, 255, .1);\n  --wb-bg-row-selected: var(--wb-bg-item-selected);\n  --wb-text-link-default: #60a5fa;\n  --wb-accent-purple-light: var(--wb-palette-purple-4);\n  --wb-bg-purple: var(--wb-accent-purple-light);\n  --wb-bg-purple-light: var(--wb-palette-purple-2);\n  --wb-border-purple: var(--wb-palette-purple-3);\n  --wb-bg-inset-strong: var(--wb-palette-gray-3);\n  --wb-border-faint: var(--wb-palette-black-10);\n  --wb-border-mask: var(--wb-palette-black-10);\n  --wb-text-placeholder-soft: var(--wb-palette-black-30);\n  --wb-shadow-card-soft: 0 16px 32px -8px rgba(0, 0, 0, .03);\n  --wb-bg-card-hover: color-mix(in srgb, var(--wb-palette-black-100) 6%, var(--wb-bg-card));\n  --wb-bg-active-hover: #F7F8FA;\n  --wb-border-subtle-soft: #EFEFEF;\n  --wb-border-selected: #C9CDD4;\n  --wb-color-text-subtle: #777777;\n  --wb-todo-menu-bg-hover: var(--wb-palette-gray-4);\n  --wb-todo-menu-bg-active: var(--wb-palette-gray-5);\n  --wb-todo-menu-icon-default: var(--wb-palette-black-70);\n  --wb-todo-menu-text-default: var(--wb-palette-black-90);\n  --wb-todo-menu-text-heading: var(--wb-palette-black-30);\n  --wb-todo-menu-text-view-more: var(--wb-palette-black-50);\n  --wb-menu-item-danger-fg: #f14c4c;\n  --wb-icon-strong: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-icon-primary: var(--wb-palette-black-90);\n  --wb-icon-secondary: var(--wb-palette-black-70);\n  --wb-icon-medium: var(--wb-palette-black-70);\n  --wb-icon-tertiary: var(--wb-palette-black-50);\n  --wb-icon-muted: var(--wb-palette-black-30);\n  --wb-status-success: var(--wb-palette-green-8);\n  --wb-status-warning: var(--wb-palette-orange-8);\n  --wb-status-error: var(--wb-palette-red-8);\n  --wb-status-info: var(--wb-palette-brand-8);\n  --wb-status-warning-soft: var(--wb-palette-orange-1);\n  --wb-status-error-soft: var(--wb-palette-red-1);\n  --wb-sidebar-bg: var(--wb-color-bg-primary-default);\n  --wb-sidebar-border: var(--wb-color-bg-primary-hover);\n  --wb-sidebar-mask-end: var(--wb-sidebar-bg);\n  --wb-text-version-badge: var(--wb-palette-black-20);\n  --wb-text-enterprise: var(--wb-color-text-warning-default);\n  --wb-scrollbar-thumb: var(--wb-palette-black-20);\n  --wb-scrollbar-thumb-hover: var(--wb-palette-black-30);\n  --wb-scrollbar-thumb-bg: rgba(0, 0, 0, .12);\n  --wb-badge-warning-bg: var(--wb-status-warning-soft);\n  --wb-badge-warning-fg: var(--wb-color-text-warning-default);\n  --wb-badge-success-bg: var(--wb-palette-green-1);\n  --wb-badge-success-fg: var(--wb-color-text-success-active);\n  --wb-accent-unread: var(--wb-palette-brand-8);\n  --wb-bg-pill-active: rgba(0, 0, 0, .75);\n  --wb-bg-pill-active-hover: rgba(0, 0, 0, .82);\n  --wb-bg-pill-hover: #fafafa;\n  --wb-task-starter-trigger-bg-hover: #ebebeb;\n  --wb-quick-action-item-bg-hover: #ebebeb;\n  --wb-quick-action-item-border-hover: #e5e5e5;\n  --wb-home-composer-chip-bg-hover: #f2f2f2;\n  --wb-mode-selector-shadow: 0 8px 24px rgba(15, 23, 42, .1), 0 2px 6px rgba(15, 23, 42, .04);\n  --wb-text-connector: #FFFFFF;\n  --wb-connector-blue: #4F7DF3;\n  --wb-connector-blue-bg: #EAF2FF;\n  --wb-connector-green: #31A354;\n  --wb-connector-green-bg: #ECFDF3;\n  --wb-connector-amber: #F3B434;\n  --wb-connector-amber-bg: #FFF7E0;\n  --wb-connector-red: #E05243;\n  --wb-connector-red-bg: #FEF0EE;\n  --wb-connector-purple: #7B61FF;\n  --wb-connector-purple-bg: #F1EEFF;\n  --wb-connector-orange: #F97316;\n  --wb-connector-orange-bg: #FFF0E6;\n  --wb-connector-slate: #64748B;\n  --wb-connector-slate-bg: #F1F5F9;\n  --wb-connector-sky: #0EA5E9;\n  --wb-connector-sky-bg: #E8F7FF;\n  --wb-bg-connector-google-sheets: var(--wb-connector-blue);\n  --wb-bg-connector-google-drive: var(--wb-connector-amber);\n  --wb-bg-connector-notion: var(--wb-connector-purple);\n  --wb-bg-connector-google-docs: #6B7280;\n  --wb-bg-connector-linear: #6366F1;\n  --wb-bg-connector-github: var(--wb-connector-green);\n  --wb-bg-connector-gmail: var(--wb-connector-red);\n  --wb-bg-connector-slack: var(--wb-connector-orange);\n  --wb-bg-connector-figma: #F05A3A;\n  --wb-border-drag-indicator: var(--wb-palette-brand-8);\n  --wb-connector-detail-try-loading-bg: #CCCCCC;\n  --wb-connector-detail-surface-bg: #FAFAFA;\n  --wb-connector-detail-flow-dot-bg: #F2F2F2;\n  --wb-connector-token-input-placeholder: #C6C6C6;\n  --wb-toast-info-icon: #0052D9;\n  --wb-brand-wechat-green: #0BC160;\n  --wb-brand-wechat-green-hover: #07A152;\n  --wb-brand-wechat-green-connected: #07C160;\n  --wb-bg-overlay-elevated: rgba(60, 60, 64, .78);\n  --wb-bg-scrim-light: rgba(255, 255, 255, .8);\n  --wb-color-text-on-scrim-light: rgba(0, 0, 0, .42);\n  --wb-bg-warning-soft-strong: rgba(245, 158, 11, .16);\n  --wb-border-input-soft-dark: rgba(255, 255, 255, .38);\n  --wb-control-checkbox-selected-bg: var(--wb-palette-black-90);\n  --wb-control-checkbox-selected-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-control-checkbox-selected-fg: var(--wb-palette-white-100);\n  --wb-checkbox-bg-default: transparent;\n  --wb-checkbox-border-default: var(--wb-palette-black-20);\n  --wb-checkbox-border-hover: var(--wb-palette-black-50);\n  --wb-checkbox-bg-selected: var(--wb-palette-black-75);\n  --wb-checkbox-border-selected: var(--wb-palette-black-75);\n  --wb-checkbox-icon-selected: var(--wb-palette-gray-1);\n  --wb-bg-input-slot-gradient:\n    linear-gradient(\n      180deg,\n      #f0f0f0 0%,\n      #f5f5f5 100%);\n  --wb-bg-surface-overlay-soft: rgba(0, 0, 0, .04);\n  --wb-bg-surface-overlay-strong: rgba(0, 0, 0, .08);\n  --wb-text-faded: rgba(0, 0, 0, .35);\n  --wb-border-overlay: rgba(0, 0, 0, .38);\n  --wb-accent-link-soft: rgba(26, 121, 255, .14);\n  --wb-accent-link-soft-hover: rgba(64, 128, 255, .12);\n  --wb-icon-folder: #e89a2d;\n  --wb-status-info-blue: #60a5fa;\n  --wb-status-success-muted: #10b981;\n  --wb-status-warning-muted: #f59e0b;\n  --wb-status-success-soft-bg: rgba(16, 185, 129, .1);\n  --wb-status-warning-soft-bg: rgba(245, 158, 11, .1);\n  --wb-status-error-soft-bg: rgba(255, 77, 79, .1);\n  --wb-alert-success-bg: #d1fae5;\n  --wb-alert-success-text: #047857;\n  --wb-alert-info-bg: #dbeafe;\n  --wb-alert-info-text: var(--wb-palette-blue-8);\n  --wb-alert-warning-bg: #fef3c7;\n  --wb-alert-warning-text: #d97706;\n  --wb-alert-warning-bg-fc: #F9F1E8;\n  --wb-alert-warning-text-fc: #C04100;\n  --wb-alert-error-bg: #fef2f2;\n  --wb-alert-error-text: #dc2626;\n  --wb-badge-gold: #d4a017;\n  --wb-badge-gold-bg: #f0c040;\n  --wb-badge-gold-fg: #856404;\n  --wb-badge-pending-bg: #3d3d3d;\n  --wb-badge-pending-fg: var(--wb-palette-white-100);\n  --wb-bg-skeleton-highlight: rgba(128, 128, 128, .18);\n  --wb-onboarding-brand-bg-blue: #e8f0ff;\n  --wb-onboarding-brand-bg-green: #e8f8f1;\n  --wb-onboarding-arrow-default: #b8bcc6;\n  --wb-onboarding-arrow-active: #4ecba0;\n  --wb-onboarding-arrow-fade: #a8d9c5;\n  --wb-border-tooltip: #d1d5db;\n  --wb-bg-popover-picker: var(--wb-bg-popover);\n  --wb-banner-accent-bg: #fde68a;\n  --wb-tdoc-icon-bg: #e8f0ff;\n  --wb-switcher-bg: rgba(0, 0, 0, .06);\n  --wb-switcher-thumb-bg: #FFFFFF;\n  --wb-switcher-text: rgba(0, 0, 0, .7);\n  --wb-switcher-text-active: rgba(0, 0, 0, .88);\n  --wb-switcher-text-hover: rgba(0, 0, 0, .85);\n  --wb-tag-check-accent: #f7d18f;\n  --wb-tag-hot-gradient-start: #ff6b6b;\n  --wb-tag-hot-gradient-end: #ee5a24;\n  --wb-tag-operational-text: #393939;\n  --wb-scene-tag-bg: rgba(0, 0, 0, .9);\n  --wb-scene-tag-fg: #fff;\n  --wb-scene-tag-bg-hover: rgba(0, 0, 0, 1);\n  --wb-scene-tag-grey-bg: rgba(0, 0, 0, .1);\n  --wb-scene-tag-grey-fg: var(--wb-palette-black-90);\n  --wb-scene-tag-grey-bg-hover: var(--wb-color-bg-primary-hover);\n  --wb-tag-skill-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 10%, transparent);\n  --wb-tag-skill-bg-hover-dark: rgba(255, 255, 255, .14);\n  --wb-home-composer-card-bg: var(--wb-palette-gray-1);\n  --wb-home-composer-sub-card-bg: var(--wb-palette-gray-3);\n  --wb-home-composer-arrow-fg: #494949;\n  --wb-quick-actions-fade-bg: var(--wb-palette-gray-1);\n  --wb-apps-toggle-color: rgba(0, 0, 0, .25);\n  --wb-apps-toggle-color-hover: rgba(0, 0, 0, .45);\n  --wb-apps-toggle-line-dark: rgba(255, 255, 255, .08);\n  --wb-apps-toggle-line-dark-hover: rgba(255, 255, 255, .15);\n  --wb-activity-card-border: rgba(15, 23, 42, .05);\n  --wb-activity-card-shadow: 0 18px 44px rgba(15, 23, 42, .1);\n  --wb-activity-card-close-default: rgba(31, 41, 55, .35);\n  --wb-activity-card-close-hover: rgba(31, 41, 55, .65);\n  --wb-activity-card-action-fg: rgba(255, 255, 255, .9);\n  --wb-activity-card-dark-bg: #2A2D3A;\n  --wb-mode-selector-label: #979797;\n  --wb-mode-switch-bg: #E8E8E8;\n  --wb-mode-btn-text: #666;\n  --wb-mode-btn-active-bg: #000;\n  --wb-mode-btn-active-fg: #fff;\n  --wb-mode-btn-hover-bg: rgba(0, 0, 0, .08);\n  --wb-mode-tag-fg: #fff;\n  --wb-quick-action-arrow-bg: #f0f0f0;\n  --wb-quick-action-selected-bg: #6C4DFF;\n  --wb-quick-action-selected-fg: var(--wb-palette-white-100);\n  --wb-quick-action-sub-item-hover-bg: rgba(0, 0, 0, .06);\n  --wb-dropdown-bg-color: var(--wb-bg-popover);\n  --wb-dropdown-item-hover-bg-color: var(--wb-bg-hover-light);\n  --wb-dropdown-border-color: var(--wb-border-default);\n  --wb-question-floating-card-bg: var(--wb-bg-card);\n  --wb-question-floating-card-border: var(--wb-border-default);\n  --wb-question-floating-card-shadow: 0px 16px 32px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-question-floating-hover-bg: var(--wb-bg-hover);\n  --wb-question-floating-number-active-bg: var(--wb-palette-white-100);\n  --wb-question-floating-number-bg: var(--wb-palette-gray-3);\n  --wb-model-tip-bg: rgba(0, 0, 0, .7);\n  --wb-model-tip-text-color: rgba(255, 255, 255, .9);\n  --wb-tab-active-border: var(--wb-palette-purple-2);\n  --wb-tab-active-fg: var(--wb-palette-purple-5);\n  --wb-tab-gradient-light:\n    linear-gradient(\n      90deg,\n      #f5f0ff,\n      #fef8e8);\n  --wb-avatar-bg-accent: var(--wb-palette-cyan-2);\n  --wb-avatar-bg-fallback-1: #6366f1;\n  --wb-avatar-bg-fallback-2: #8b5cf6;\n  --wb-avatar-bg-fallback-3: #ec4899;\n  --wb-avatar-bg-fallback-4: #f59e0b;\n  --wb-avatar-bg-fallback-5: #10b981;\n  --wb-avatar-bg-fallback-6: #14b8a6;\n  --wb-avatar-bg-fallback-7: #06b6d4;\n  --wb-avatar-bg-fallback-8: #3b82f6;\n  --wb-favorite-bg-soft: rgba(239, 68, 68, .06);\n  --wb-favorite-btn-bg: rgba(255, 255, 255, .85);\n  --wb-discover-text-expert: var(--wb-accent-violet);\n  --wb-discover-bg-expert-soft: var(--wb-accent-violet-soft);\n  --wb-discover-text-mcp: var(--wb-accent-cyan);\n  --wb-discover-bg-mcp-soft: var(--wb-accent-cyan-soft);\n  --wb-accent-purple: var(--wb-palette-purple-8);\n  --wb-accent-purple-soft: color-mix(in srgb, var(--wb-palette-purple-8) 8%, transparent);\n  --wb-accent-blue: var(--wb-palette-blue-5);\n  --wb-accent-blue-soft: color-mix(in srgb, var(--wb-palette-blue-5) 8%, transparent);\n  --wb-accent-pink: #ec4899;\n  --wb-accent-pink-soft: rgba(236, 72, 153, .08);\n  --wb-accent-teal: var(--wb-palette-cyan-6);\n  --wb-accent-teal-soft: color-mix(in srgb, var(--wb-palette-cyan-6) 8%, transparent);\n  --wb-accent-orange: #f5a623;\n  --wb-accent-orange-soft: rgba(245, 166, 35, .08);\n  --wb-card-selected-bg: #f9fafb;\n  --wb-card-selected-border: #e5e7eb;\n  --wb-claw-text-wecom: #1565c0;\n  --wb-claw-text-feishu: var(--wb-palette-cyan-7);\n  --wb-claw-text-qq: #7b1fa2;\n  --wb-claw-text-dingtalk: #e65100;\n  --wb-claw-text-wechat: #2e7d32;\n  --wb-claw-text-yuanbao: #f57f17;\n  --wb-claw-text-link: #4a90d9;\n  --wb-claw-text-link-hover: #2a6cb8;\n  --wb-share-bar-bg: var(--wb-bg-card);\n  --wb-check-checkmark: var(--wb-palette-white-100);\n  --wb-color-bg-modal: var(--wb-bg-modal);\n  --wb-color-bg-input: rgba(0, 0, 0, .04);\n  --wb-color-mask-strong: rgba(0, 0, 0, .8);\n  --wb-netdrive-text-primary: #333333;\n  --wb-netdrive-text-secondary: #666666;\n  --wb-netdrive-border: #d1d5db;\n  --wb-netdrive-error-fg: #cf222e;\n  --wb-netdrive-text-disabled: rgba(26, 26, 26, .6);\n  --wb-voice-input-card-bg: var(--wb-bg-card);\n  --wb-voice-input-card-border: #d1d5db;\n  --wb-voice-input-text-primary: var(--wb-color-text-primary);\n  --wb-voice-input-text-secondary: #666666;\n  --wb-voice-input-guide-link: #0078d4;\n  --wb-voice-input-hover-bg: var(--wb-bg-hover);\n  --wb-voice-input-btn-primary-bg: #0078d4;\n  --wb-voice-input-btn-primary-fg: var(--wb-palette-white-100);\n  --wb-voice-input-pill-bg: var(--wb-palette-gray-2);\n  --wb-voice-input-confirm: #00c29a;\n  --wb-main-area-background: var(--wb-bg-primary);\n  --wb-main-area-border-color: var(--wb-border-subtle);\n  --wb-main-area-box-shadow: 0px 12px 24px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-ring-bg-track: rgba(0, 0, 0, .2);\n  --wb-ring-bg-progress: rgba(0, 0, 0, .7);\n  --wb-input-button-text: rgba(0, 0, 0, .9);\n  --wb-file-op-pdf: #E57163;\n  --wb-file-op-code: #5A8AA4;\n  --wb-file-op-word: #528AE3;\n  --wb-file-op-presentation: #D24F31;\n  --wb-file-op-spreadsheet: #51A776;\n  --wb-status-neutral: #94a3b8;\n  --wb-status-neutral-soft-bg: rgba(148, 163, 184, .12);\n  --wb-status-info-blue-soft-bg: rgba(96, 165, 250, .08);\n  --wb-modify-marker-bg: rgba(255, 187, 0, .15);\n  --wb-code-syntax-keyword: var(--wb-palette-blue-10);\n  --wb-code-syntax-string: #0a3069;\n  --wb-code-syntax-error: #cf222e;\n  --wb-code-syntax-number: #953800;\n  --wb-code-syntax-function: #8250df;\n  --wb-code-border-input: color-mix(in srgb, #d0d7de 20%, transparent);\n  --wb-accent-violet: var(--wb-palette-purple-6);\n  --wb-accent-cyan: var(--wb-palette-cyan-5);\n  --wb-accent-violet-soft: color-mix(in srgb, var(--wb-palette-purple-6) 6%, transparent);\n  --wb-accent-cyan-soft: color-mix(in srgb, var(--wb-palette-cyan-5) 6%, transparent);\n  --wb-palette-green-vivid: #16A34A;\n  --wb-palette-amber-vivid: #CA8A04;\n  --wb-palette-red-vivid: #DC2626;\n  --wb-palette-success-vivid: var(--wb-palette-green-vivid);\n  --wb-palette-warning-vivid: var(--wb-palette-amber-vivid);\n  --wb-palette-error-vivid: var(--wb-palette-red-vivid);\n  --wb-status-success-vivid: var(--wb-palette-green-vivid);\n  --wb-status-warning-vivid: var(--wb-palette-amber-vivid);\n  --wb-status-error-vivid: var(--wb-palette-red-vivid);\n  --wb-bg-blue-soft: rgba(74, 144, 217, .04);\n  --wb-bg-green-soft: rgba(52, 168, 83, .08);\n  --wb-badge-doc: #4285f4;\n  --wb-badge-sheet: #34a853;\n  --wb-badge-img: #f9ab00;\n  --wb-avatar-bg: rgb(96, 125, 139);\n  --wb-text-author: rgb(107, 114, 128);\n  --wb-bg-overlay-dropzone: rgba(30, 30, 46, .7);\n  --wb-bg-card-action: rgba(30, 30, 46, .9);\n  --wb-bg-error-hover: rgba(234, 67, 53, .12);\n  --wb-bg-error-hover-dark: rgba(239, 83, 80, .1);\n  --wb-bg-success-soft-dark: rgba(76, 175, 80, .15);\n  --wb-bg-success-vivid-soft: color-mix(in srgb, var(--wb-palette-success-vivid) 10%, transparent);\n  --wb-bg-warning-vivid-soft: color-mix(in srgb, var(--wb-palette-warning-vivid) 10%, transparent);\n  --wb-bg-error-vivid-soft: color-mix(in srgb, var(--wb-palette-error-vivid) 10%, transparent);\n  --wb-bg-error-vivid-subtle: color-mix(in srgb, var(--wb-palette-error-vivid) 8%, transparent);\n  --wb-border-error-vivid-subtle: color-mix(in srgb, var(--wb-palette-error-vivid) 20%, transparent);\n  --wb-bg-favorite-soft: rgba(239, 68, 68, .08);\n  --wb-text-danger: var(--wb-palette-error-vivid);\n  --wb-activity-blue-10: rgba(59, 130, 246, .1);\n  --wb-activity-green-25: rgba(34, 197, 94, .25);\n  --wb-activity-green-15: rgba(34, 197, 94, .15);\n  --wb-activity-blue-15: rgba(59, 130, 246, .15);\n  --wb-activity-green-40: rgba(34, 197, 94, .4);\n  --wb-activity-green-20: rgba(34, 197, 94, .2);\n  --wb-bg-overlay-on-dark: rgba(255, 255, 255, .05);\n  --wb-bg-badge-on-image: rgba(0, 0, 0, .24);\n  --wb-bg-badge-on-image-hover: rgba(0, 0, 0, .36);\n  --wb-dropdown-bg-color-fc: #2d2d2d;\n  --wb-question-floating-card-shadow-fc: 0px 12px 24px -8px rgba(0, 0, 0, .02), 0px 2px 4px -4px rgba(0, 0, 0, .02);\n  --wb-spacing-0: 0;\n  --wb-spacing-1: 2px;\n  --wb-spacing-2: 4px;\n  --wb-spacing-2-5: 5px;\n  --wb-spacing-3: 8px;\n  --wb-spacing-4: 12px;\n  --wb-spacing-5: 16px;\n  --wb-spacing-6: 20px;\n  --wb-spacing-7: 24px;\n  --wb-spacing-8: 32px;\n  --wb-spacing-9: 40px;\n  --wb-spacing-10: 48px;\n  --wb-radius-none: 0;\n  --wb-radius-xs: 2px;\n  --wb-radius-sm: 4px;\n  --wb-radius-md: 6px;\n  --wb-radius-lg: 8px;\n  --wb-radius-xl: 12px;\n  --wb-radius-2xl: 16px;\n  --wb-radius-3xl: 20px;\n  --wb-radius-4xl: 24px;\n  --wb-font-code-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    monospace;\n  --wb-font-mono: var(--wb-font-code-family);\n  --wb-font-display-size: 32px;\n  --wb-font-display-line-height: 40px;\n  --wb-font-display-weight: 700;\n  --wb-font-h1-size: 24px;\n  --wb-font-h1-line-height: 32px;\n  --wb-font-h1-weight: 600;\n  --wb-font-h2-size: 20px;\n  --wb-font-h2-line-height: 28px;\n  --wb-font-h2-weight: 600;\n  --wb-font-h3-size: 16px;\n  --wb-font-h3-line-height: 24px;\n  --wb-font-h3-weight: 600;\n  --wb-font-body-size: 14px;\n  --wb-font-body-line-height: 22px;\n  --wb-font-body-weight: 400;\n  --wb-font-body-strong-size: 14px;\n  --wb-font-body-strong-line-height: 22px;\n  --wb-font-body-strong-weight: 600;\n  --wb-font-caption-size: 12px;\n  --wb-font-caption-line-height: 18px;\n  --wb-font-caption-weight: 400;\n  --wb-font-code-size: 13px;\n  --wb-font-code-line-height: 20px;\n  --wb-shadow-none: none;\n  --wb-shadow-sm: 0 1px 2px color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-shadow-md: 0 2px 8px color-mix(in srgb, var(--wb-palette-black-100) 12%, transparent);\n  --wb-shadow-lg: 0 4px 16px color-mix(in srgb, var(--wb-palette-black-100) 16%, transparent);\n  --wb-shadow-xl: 0 8px 32px color-mix(in srgb, var(--wb-palette-black-100) 20%, transparent);\n  --wb-shadow-popover: 0 4px 12px -4px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent), 0 3px 6px -8px color-mix(in srgb, var(--wb-palette-black-100) 4%, transparent);\n  --wb-shadow-dropdown:\n    0 4px 6px -1px rgba(0, 0, 0, .1),\n    0 2px 4px -1px rgba(0, 0, 0, .06),\n    0 12px 28px rgba(0, 0, 0, .15);\n  --wb-shadow-dialog: 0px 8px 48px 0px rgba(0, 0, 0, .08), 0px 6px 12px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-input: 0 12px 24px -8px color-mix(in srgb, var(--wb-palette-black-100) 2%, transparent), 0 2px 4px -4px color-mix(in srgb, var(--wb-palette-black-100) 2%, transparent);\n  --wb-shadow-selection-quote-popup: 0px 4px 12px 0px rgba(0, 0, 0, .04), 0px 3px 6px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-medium: 0 12px 32px rgba(0, 0, 0, .1);\n  --wb-shadow-heavy: 0 20px 60px rgba(0, 0, 0, .15);\n  --wb-shadow-focus-ring: 0 0 0 2px rgba(26, 121, 255, .1);\n  --wb-shadow-card-hover: 0 8px 20px rgba(0, 0, 0, .12);\n  --wb-shadow-input-card: inset 0 -1px 0 rgba(0, 0, 0, .04);\n  --wb-shadow-dialog-md: 0 8px 24px rgba(0, 0, 0, .08);\n  --wb-shadow-tooltip: 0 4px 12px rgba(0, 0, 0, .16);\n  --wb-shadow-message-toolbar: 0px 6px 24px 0px rgba(0, 0, 0, .04), 0px 4px 6px 0px rgba(0, 0, 0, .04);\n  --wb-shadow-large: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05);\n  --wb-shadow-card: 0 1px 2px rgba(0, 0, 0, .04);\n  --wb-shadow-elevated: 0 8px 24px rgba(15, 23, 42, .1);\n  --wb-shadow-focus-blue: 0 0 0 2px rgba(74, 144, 217, .15);\n  --wb-shadow-error: 0 4px 12px rgba(244, 67, 54, .3);\n  --wb-shadow-drawer: -4px -2px 16px rgba(0, 0, 0, .06), 0 0 0 1px rgba(0, 0, 0, .03);\n  --wb-motion-duration-fast: .12s;\n  --wb-motion-duration-sm: .15s;\n  --wb-motion-duration-base: .2s;\n  --wb-motion-duration-slow: .32s;\n  --wb-motion-easing-standard: cubic-bezier(.4, 0, .2, 1);\n  --wb-size-control-sm: 24px;\n  --wb-size-control-md: 32px;\n  --wb-size-control-lg: 40px;\n  --wb-icon-size-sm: 12px;\n  --wb-icon-size-md: 16px;\n  --wb-icon-size-lg: 20px;\n  --wb-colleagues-layer-chat-float: 900;\n  --wb-colleagues-layer-chat-menu: 2;\n  --wb-colleagues-layer-dialog: 1200;\n  --wb-colleagues-layer-dialog-popover: 1205;\n  --wb-colleagues-layer-dialog-local-modal: 1208;\n  --wb-colleagues-layer-dialog-hire: 1210;\n  --wb-colleagues-layer-dialog-tdocs: 1220;\n  --wb-colleagues-layer-dialog-bind-channel: 1230;\n  --wb-colleagues-layer-dialog-publish: 1240;\n  --wb-colleagues-layer-promo: 1400;\n  --wb-colleagues-layer-promo-loading: 1410;\n  --wb-colleagues-layer-confirm: 1500;\n  --wb-button-height-medium: 32px;\n  --wb-button-height-small: 24px;\n  --wb-button-height-large: 48px;\n  --wb-button-min-width-medium: 68px;\n  --wb-button-min-width-small: 40px;\n  --wb-button-padding-medium: var(--wb-spacing-4);\n  --wb-button-padding-small: var(--wb-spacing-3);\n  --wb-button-padding-large: var(--wb-spacing-8);\n  --wb-button-gap-medium: var(--wb-spacing-2);\n  --wb-button-gap-small: var(--wb-spacing-1);\n  --wb-button-gap-large: var(--wb-spacing-3);\n  --wb-button-font-size-medium: 14px;\n  --wb-button-font-size-small: 12px;\n  --wb-button-font-size-large: 14px;\n  --wb-button-line-height-medium: 22px;\n  --wb-button-line-height-small: 20px;\n  --wb-button-line-height-large: 22px;\n  --wb-button-border-radius-medium: var(--wb-radius-lg);\n  --wb-button-border-radius-small: var(--wb-radius-md);\n  --wb-button-border-radius-large: var(--wb-radius-xl);\n  --wb-button-icon-size-medium: 16px;\n  --wb-button-primary-bg: var(--wb-palette-black-90);\n  --wb-button-primary-bg-hover: var(--wb-palette-black-75);\n  --wb-button-primary-bg-active: var(--wb-palette-black-75);\n  --wb-button-primary-bg-disabled: var(--wb-palette-black-20);\n  --wb-button-primary-fg: var(--wb-palette-white-100);\n  --wb-button-primary-fg-disabled: var(--wb-palette-white-100);\n  --wb-button-secondary-bg: var(--wb-palette-white-100);\n  --wb-button-secondary-bg-hover: var(--wb-palette-gray-2);\n  --wb-button-secondary-bg-active: var(--wb-palette-gray-2);\n  --wb-button-secondary-bg-disabled: var(--wb-palette-gray-2);\n  --wb-button-secondary-fg: var(--wb-palette-black-90);\n  --wb-button-secondary-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-secondary-border: #DEDEDE;\n  --wb-button-grey-bg: var(--wb-palette-gray-4);\n  --wb-button-grey-bg-hover: var(--wb-palette-gray-5);\n  --wb-button-grey-bg-active: var(--wb-palette-gray-5);\n  --wb-button-grey-bg-disabled: var(--wb-palette-gray-4);\n  --wb-button-grey-fg: var(--wb-palette-black-90);\n  --wb-button-grey-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-ghost-bg: transparent;\n  --wb-button-ghost-bg-hover: rgba(0, 0, 0, .06);\n  --wb-button-ghost-bg-active: rgba(0, 0, 0, .06);\n  --wb-button-ghost-fg: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-hover: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-active: var(--wb-palette-black-90);\n  --wb-button-ghost-fg-disabled: var(--wb-palette-black-30);\n  --wb-button-link-bg: transparent;\n  --wb-button-link-bg-hover: transparent;\n  --wb-button-link-bg-active: transparent;\n  --wb-button-link-bg-disabled: transparent;\n  --wb-button-link-fg: #1470B4;\n  --wb-button-link-fg-hover: #1470B4;\n  --wb-button-link-fg-disabled: #94B7D1;\n  --wb-button-danger-bg: var(--wb-palette-red-7);\n  --wb-button-danger-bg-hover: var(--wb-palette-red-6);\n  --wb-button-danger-bg-active: var(--wb-palette-red-6);\n  --wb-button-danger-bg-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-fg-on-solid: var(--wb-palette-white-100);\n  --wb-button-danger-fg-on-solid-disabled: var(--wb-palette-white-100);\n  --wb-button-danger-fg: var(--wb-palette-red-8);\n  --wb-button-danger-fg-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-border: var(--wb-palette-red-8);\n  --wb-button-danger-border-disabled: var(--wb-palette-red-3);\n  --wb-button-danger-bg-soft-hover: color-mix(in srgb, var(--wb-color-text-error-default) 8%, transparent);\n  --wb-button-danger-bg-soft-active: color-mix(in srgb, var(--wb-color-text-error-default) 16%, transparent);\n  --wb-button-loading-primary-fg: var(--wb-palette-white-100);\n  --wb-button-loading-secondary-fg: var(--wb-palette-black-100);\n  --wb-button-loading-grey-fg: var(--wb-palette-black-100);\n  --wb-button-loading-ghost-fg: var(--wb-palette-black-100);\n  --wb-button-loading-link-fg: #1470B4;\n  --wb-button-loading-danger-fg-on-solid: var(--wb-palette-white-100);\n  --wb-button-loading-danger-fg: var(--wb-color-text-error-disabled);\n  --wb-button-success-bg: #0CBF5B;\n  --wb-button-success-bg-hover: #09a84f;\n  --wb-button-login-bg: #1a1a1a;\n  --wb-button-login-bg-hover: var(--wb-palette-black-100);\n  --wb-button-login-bg-active: var(--wb-palette-black-100);\n  --wb-button-inverse-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 96%, transparent);\n  --wb-button-inverse-bg-active: color-mix(in srgb, var(--wb-palette-black-100) 80%, transparent);\n  --wb-button-inverse-fg-disabled: var(--wb-palette-white-60);\n  --wb-button-confirm-bg: var(--wb-palette-black-90);\n  --wb-button-cancel-bg: var(--wb-palette-gray-4);\n  --wb-button-soft-bg: color-mix(in srgb, var(--wb-palette-black-100) 8%, transparent);\n  --wb-button-soft-bg-hover: color-mix(in srgb, var(--wb-palette-black-100) 12%, transparent);\n  --wb-button-secondaryfill-bg-hover: #f0f0f0;\n  --wb-button-secondary-fg-hover: var(--wb-palette-black-100);\n  --wb-modal-width: 100%;\n  --wb-modal-max-height: calc(100vh - 160px) ;\n  --wb-modal-max-width-s: 480px;\n  --wb-modal-max-width-m: 640px;\n  --wb-modal-max-width-ml: 640px;\n  --cb-text-primary: var(--wb-color-text-primary);\n  --cb-text-secondary: var(--wb-color-text-secondary);\n  --cb-text-tertiary: var(--wb-color-text-tertiary);\n  --cb-text-disabled: var(--wb-color-text-disabled);\n  --cb-text-solid: var(--wb-color-text-solid);\n  --cb-text-error-active: var(--wb-color-text-error-active);\n  --cb-toast-info-color: var(--wb-toast-info-icon);\n  --cb-text-link: var(--wb-color-text-link-default);\n  --cb-text-link-hover: var(--wb-color-text-link-hover);\n  --cb-bg-primary-default: var(--wb-color-bg-primary-default);\n  --cb-bg-primary-hover: var(--wb-color-bg-primary-hover);\n  --cb-bg-primary-active: var(--wb-color-bg-primary-hover-strong);\n  --cb-dialog-mask: var(--wb-palette-black-60);\n  --cb-panel-bg-primary: var(--wb-bg-primary);\n  --cb-sidebar-bg: var(--wb-sidebar-bg);\n  --cb-text-quaternary: var(--wb-color-text-disabled);\n  --cb-border-secondary: var(--wb-color-border-secondary);\n  --cb-border-drag-indicator: var(--wb-border-drag-indicator);\n  --cb-shadow-popover: var(--wb-shadow-popover);\n  --cb-shadow-message-toolbar: var(--wb-shadow-popover);\n  --cb-shadow-popover-fc: var(--wb-shadow-popover);\n  --cb-scrollbar-thumb: var(--wb-scrollbar-thumb);\n  --cb-scrollbar-thumb-hover: var(--wb-scrollbar-thumb-hover);\n  --cb-popover-bg-color: var(--wb-bg-primary);\n  --cb-popover-background: var(--wb-bg-primary);\n  --cb-popover-border: var(--wb-color-border-primary);\n  --cb-popover-divider: var(--wb-border-popover);\n  --cb-popover-divider-fc: var(--wb-color-border-tertiary);\n  --cb-popover-border-fc: var(--wb-color-border-primary);\n  --cb-popover-bg: var(--wb-bg-primary);\n  --cb-dropdown-item-hover-bg-color: var(--wb-color-bg-primary-hover-strong);\n  --cb-hover-bg: var(--wb-bg-hover);\n  --cb-icon-button-hover-background: var(--wb-bg-hover);\n  --cb-popover-bg-fc: var(--wb-bg-primary);\n  --cb-popover-bg-color-fc: var(--wb-bg-primary);\n  --cb-popover-background-fc: var(--wb-bg-primary);\n  --cb-hover-bg-fc: var(--wb-bg-hover);\n  --cb-icon-button-hover-background-fc: var(--wb-bg-hover);\n  --cb-popover-active-background: var(--wb-color-bg-primary-hover-strong);\n  --cb-list-item-active-bg: var(--wb-color-bg-primary-hover-strong);\n  --cb-list-item-selected-bg: var(--wb-palette-gray-2);\n  --cb-list-item-selected-foreground: var(--wb-color-text-primary);\n  --cb-search-input-bg: var(--wb-bg-secondary, #F7F7F7);\n  --cb-main-area-background: var(--wb-bg-primary);\n  --cb-green-color: var(--wb-brand-primary);\n  --cb-switch-active-bg: var(--wb-brand-primary);\n  --cb-switch-bg: var(--wb-palette-gray-5);\n  --cb-success-color: var(--wb-brand-primary);\n  --cb-error-color: var(--wb-color-text-error-default);\n  --cb-toggle-track-off-bg: var(--wb-bg-hover);\n  --cb-switch-thumb-bg: var(--wb-palette-white-100);\n  --cb-text-muted: var(--wb-color-text-disabled);\n  --cb-link-foreground: var(--wb-color-text-link-default);\n  --cb-input-active-border: var(--cb-green-color);\n  --cb-voice-pill-bg: var(--wb-palette-gray-2);\n  --cb-voice-text: var(--wb-color-text-secondary);\n  --cb-voice-confirm-color: var(--wb-brand-primary);\n  --cb-voice-mic-hover-bg: var(--wb-color-bg-primary-hover-strong);\n  --cb-button-grey-bg: var(--wb-button-grey-bg);\n  --cb-button-grey-fg: var(--wb-button-grey-fg);\n  --cb-avatar-fallback-bg: var(--wb-color-border-secondary);\n  --cb-avatar-fallback-fg: var(--wb-color-text-tertiary);\n  --cb-main-area-border-color: var(--wb-main-area-border-color);\n  --cb-main-area-box-shadow: var(--wb-main-area-box-shadow);\n  --chat-input-area-header-font-color: var(--wb-color-text-primary);\n  --cb-input-button-foreground: var(--wb-input-button-text);\n  --cb-dropdown-bg-color: var(--wb-dropdown-bg-color);\n  --cb-dropdown-border-color: var(--wb-dropdown-border-color);\n  --cb-question-floating-text-secondary: var(--wb-color-text-solid);\n  --cb-model-tip-bg: var(--wb-model-tip-bg);\n  --cb-model-tip-text-color: var(--wb-model-tip-text-color);\n  --cb-question-floating-card-border: var(--wb-color-border-secondary);\n  --cb-ring-progress: var(--wb-ring-bg-progress);\n  --cb-ring-track: var(--wb-ring-bg-track);\n  --cb-dialog-bg: var(--wb-bg-popover);\n  --cb-dialog-mask-bg: var(--wb-color-mask-color);\n  --cb-dialog-shadow: var(--wb-shadow-dialog-md);\n  --cb-dialog-content-bg: var(--wb-bg-active);\n  --cb-dialog-title-color: var(--wb-text-strong);\n  --cb-dialog-hint-color: var(--wb-text-strong);\n  --cb-dialog-warning-color: var(--wb-color-text-warning-default);\n  --cb-dialog-close-color: var(--wb-text-weak);\n  --cb-dialog-close-hover-bg: var(--wb-bg-card-strong);\n  --cb-qrcode-surface-bg: var(--wb-bg-popover);\n  --cb-spinner-track: var(--wb-color-border-secondary);\n  --cb-spinner-active: var(--wb-brand-bright);\n  --cb-dialog-btn-secondary-bg: var(--wb-bg-active);\n  --cb-dialog-btn-secondary-text: var(--wb-button-secondary-fg);\n  --cb-dialog-btn-secondary-hover-bg: var(--wb-bg-tertiary);\n  --cb-dialog-btn-primary-bg: var(--wb-button-primary-bg);\n  --cb-dialog-btn-primary-text: var(--wb-button-primary-fg);\n  --cb-dropdown-item-selected-bg-color: var(--wb-bg-hover);\n  --cb-palette-gray-2: var(--wb-palette-gray-2);\n  --cb-palette-gray-3: var(--wb-palette-gray-3);\n  --cb-palette-gray-4: var(--wb-palette-gray-4);\n  --cb-scene-tag-bg: var(--wb-palette-brand-2);\n  --cb-scene-tag-fg: var(--wb-color-text-primary);\n  --cb-border-default: var(--wb-color-border-primary);\n  --cb-font-size-offset: clamp(-1, var(--cb-font-size-offset-global, 0), 2);\n  --cb-task-icon-completed: var(--wb-color-text-disabled);\n  --cb-task-icon-waiting: var(--wb-icon-secondary);\n  --cb-task-completed-text: var(--wb-color-text-disabled, rgba(255, 255, 255, .25));\n  --wb-checkin-bg:\n    linear-gradient(\n      180deg,\n      #0DC7A4 0%,\n      #4DE49E 100%);\n  --wb-checkin-header-fg: #ffffff;\n  --wb-checkin-header-icon: #ffffff;\n  --wb-checkin-period-tag-bg: rgba(255, 255, 255, .5);\n  --wb-checkin-period-tag-fg: #008e70;\n  --wb-checkin-info-bg: #ffffff;\n  --wb-checkin-divider: #f2f2f2;\n  --wb-checkin-tomorrow-bg: #d6f0e2;\n  --wb-checkin-tomorrow-fg: #2a8a66;\n  --wb-checkin-pop-flash: #4ecba0;\n  --wb-checkin-btn-primary-bg: rgba(0, 0, 0, .75);\n  --wb-checkin-btn-primary-bg-hover: rgba(0, 0, 0, .85);\n  --wb-checkin-btn-primary-fg: #ffffff;\n  --wb-checkin-btn-primary-border: transparent;\n  --wb-checkin-btn-primary-bg-disabled: rgba(0, 0, 0, .05);\n  --wb-checkin-btn-primary-fg-disabled: rgba(0, 0, 0, .3);\n  --wb-checkin-btn-primary-border-disabled: transparent;\n  --wb-checkin-btn-success-bg: #10a37f;\n  --wb-checkin-btn-success-border: #10a37f;\n  --wb-checkin-btn-success-fg: #ffffff;\n  --wb-checkin-btn-secondary-bg: transparent;\n  --wb-checkin-btn-secondary-fg: rgba(0, 0, 0, .9);\n  --wb-checkin-btn-secondary-border: #e6e6e6;\n  --wb-checkin-btn-secondary-bg-hover: rgba(0, 0, 0, .04);\n  --ec-bg-primary: #ffffff;\n  --ec-bg-secondary: #fafafa;\n  --ec-bg-tertiary: #f5f5f5;\n  --ec-bg-hover: #f0f0f0;\n  --ec-bg-active: #f5f5f5;\n  --ec-text-primary: #1a1a1a;\n  --ec-text-secondary: #666666;\n  --ec-text-tertiary: #999999;\n  --ec-text-placeholder: #cccccc;\n  --ec-text-desc: var(--wb-color-text-secondary);\n  --ec-text-usage: var(--wb-color-text-tertiary);\n  --ec-text-use-count: var(--wb-color-text-secondary);\n  --ec-text-category-tab: var(--wb-color-text-secondary);\n  --ec-text-contrast: var(--wb-button-primary-fg);\n  --ec-text-soft: var(--wb-color-text-secondary);\n  --ec-text-strong: var(--wb-color-text-primary);\n  --ec-text-muted: var(--wb-text-muted);\n  --ec-expert-card-bg: #ffffff;\n  --ec-expert-card-hover-bg: #f0f0f0;\n  --ec-expert-card-hover-border: rgba(0, 0, 0, .08);\n  --ec-expert-card-avatar-bg: #a6d5da;\n  --ec-expert-card-shadow: 0 16px 32px rgba(0, 0, 0, .03);\n  --ec-expert-card-desc-color: rgba(0, 0, 0, .7);\n  --ec-card-tag-bg: rgba(0, 0, 0, .04);\n  --ec-card-tag-border: transparent;\n  --ec-card-tag-color: rgba(0, 0, 0, .7);\n  --ec-filter-border: transparent;\n  --ec-filter-text: var(--ec-text-category-tab);\n  --ec-filter-text-hover: var(--ec-text-secondary);\n  --ec-filter-text-active: var(--ec-text-primary);\n  --ec-primary: #1f1f1f;\n  --ec-primary-light: #f5f5f5;\n  --ec-primary-hover: #000000;\n  --ec-primary-shadow: rgba(0, 0, 0, .12);\n  --ec-primary-bg: #f5f2ff;\n  --ec-border: #e8e8e8;\n  --ec-border-light: var(--wb-border-default);\n  --ec-border-hover: var(--wb-border-strong);\n  --ec-border-subtle: var(--wb-border-default);\n  --ec-card-bg: #ffffff;\n  --ec-modal-bg: var(--wb-bg-popover);\n  --ec-card-border-static: #f0f0f0;\n  --ec-card-shadow: 0 1px 3px rgba(0, 0, 0, .06);\n  --ec-card-shadow-hover: 0 12px 32px rgba(0, 0, 0, .12);\n  --ec-card-border-hover: var(--wb-border-strong);\n  --ec-shadow-sm: var(--wb-shadow-dialog-md);\n  --ec-shadow-lg: var(--wb-shadow-dialog-md);\n  --ec-btn-gradient:\n    linear-gradient(\n      135deg,\n      #2f2f2f,\n      #111111);\n  --ec-btn-text: #ffffff;\n  --ec-btn-bg: var(--wb-button-primary-bg);\n  --ec-btn-bg-hover: var(--wb-button-primary-bg-hover);\n  --ec-surface-muted: var(--wb-bg-secondary);\n  --ec-surface-subtle: var(--wb-bg-primary);\n  --ec-surface-hover: var(--wb-bg-hover);\n  --ec-modal-tag-chip-bg: rgba(0, 0, 0, .02);\n  --ec-modal-tag-chip-color: rgba(0, 0, 0, .62);\n  --ec-modal-tag-chip-border: rgba(0, 0, 0, .06);\n  --ec-modal-quick-prompt-bg: rgba(0, 0, 0, .02);\n  --ec-modal-quick-prompt-bg-hover: rgba(0, 0, 0, .04);\n  --ec-modal-quick-prompt-color: rgba(0, 0, 0, .62);\n  --ec-modal-quick-prompt-border: rgba(0, 0, 0, .06);\n  --ec-success: #10b981;\n  --ec-warning: #f59e0b;\n  --ec-error: #ff4d4f;\n  --ec-avatar-fallback-bg-1: #6366f1;\n  --ec-avatar-fallback-bg-2: #8b5cf6;\n  --ec-avatar-fallback-bg-3: #ec4899;\n  --ec-avatar-fallback-bg-4: #f59e0b;\n  --ec-avatar-fallback-bg-5: #10b981;\n  --ec-avatar-fallback-bg-6: #3b82f6;\n  --ec-avatar-fallback-bg-7: #ef4444;\n  --ec-avatar-fallback-bg-8: #14b8a6;\n  --ec-operational-tag-bg: rgba(0, 0, 0, .05);\n  --ec-operational-tag-color: #393939;\n  --ec-operational-tag-border: transparent;\n  --ec-operational-tag-icon-color: #3d3d3d;\n  --ec-featured-scene-area-bg: #fafafa;\n  --ec-featured-scene-bg: var(--wb-palette-brand-1);\n  --ec-featured-scene-overlay:\n    linear-gradient(\n      180deg,\n      transparent 18.78%,\n      var(--wb-bg-card) 90.23%);\n  --ec-featured-scene-border:\n    linear-gradient(\n      180deg,\n      rgba(0, 0, 0, 0) 0%,\n      rgba(0, 0, 0, .08) 100%);\n  --ec-featured-scene-shadow: none;\n  --ec-featured-scene-fade-mask:\n    linear-gradient(\n      90deg,\n      rgba(250, 250, 250, 0),\n      rgba(250, 250, 250, .92));\n  --ec-featured-scene-row-hover-bg: rgba(0, 0, 0, .05);\n  --ec-featured-scene-tag-bg: rgba(0, 0, 0, .05);\n  --wb-kb-brand: #4ecba0;\n  --wb-kb-brand-hover: #3db890;\n  --wb-kb-text-primary: var(--wb-text-strong, rgba(0, 0, 0, .9));\n  --wb-kb-text-secondary: var(--wb-text-medium, rgba(0, 0, 0, .7));\n  --wb-kb-text-tertiary: var(--wb-text-weak, rgba(0, 0, 0, .5));\n  --wb-kb-text-muted: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-card-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-card-bg-soft: #f8fafd;\n  --wb-kb-card-border: #f0f4f5;\n  --wb-kb-card-border-soft: #f0f4f5;\n  --wb-kb-btn-primary-bg: var(--wb-button-primary-bg, rgba(0, 0, 0, .9));\n  --wb-kb-btn-primary-bg-hover: var(--wb-button-primary-bg-hover, #000000);\n  --wb-kb-btn-primary-fg: var(--wb-button-primary-fg, #ffffff);\n  --wb-kb-btn-surface: var(--wb-bg-primary, #ffffff);\n  --wb-kb-btn-surface-hover: var(--wb-bg-hover, #fafafa);\n  --wb-kb-btn-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-btn-border-hover: rgba(0, 0, 0, .2);\n  --wb-kb-btn-text: var(--wb-text-strong, rgba(0, 0, 0, .9));\n  --wb-kb-row-hover-bg: var(--wb-bg-hover, rgba(0, 0, 0, .05));\n  --wb-kb-row-selected-bg: var(--wb-bg-active, rgba(0, 0, 0, .08));\n  --wb-kb-tabs-container-bg: #f4f5f5;\n  --wb-kb-tabs-container-border: #ebecec;\n  --wb-kb-tabs-active-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-tabs-active-shadow: 0 1px 4px rgba(0, 0, 0, .1);\n  --wb-kb-tab-hover-bg: rgba(0, 0, 0, .04);\n  --wb-kb-dialog-bg: var(--wb-bg-popover, #ffffff);\n  --wb-kb-dialog-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-dialog-divider: var(--wb-border-subtle, rgba(229, 233, 240, .5));\n  --wb-kb-dialog-shadow: 0 8px 24px rgba(0, 0, 0, .08);\n  --wb-kb-dialog-section-label: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-input-bg: var(--wb-bg-primary, #ffffff);\n  --wb-kb-input-border: var(--wb-border-default, rgba(229, 233, 240, .6));\n  --wb-kb-input-placeholder: var(--wb-text-muted, rgba(0, 0, 0, .3));\n  --wb-kb-input-icon: #b2b2b2;\n  --wb-kb-banner-avatar-bg: #fde68a;\n  --wb-kb-checkbox-accent: rgba(0, 0, 0, .9);\n  --wb-kb-checkbox-check-color: #ffffff;\n}\n.connector-panel .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.connector-panel .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.um-header__tabs {\n  display: flex;\n  align-items: center;\n  flex-wrap: nowrap;\n  gap: 4px;\n  flex-shrink: 0;\n}\n.um-tab {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  white-space: nowrap;\n  gap: 4px;\n  height: 28px;\n  padding: 0 10px;\n  border: none;\n  border-radius: var(--wb-radius-lg, 8px);\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.um-tab:hover {\n  color: var(--wb-color-text-primary);\n}\n.um-tab--active {\n  background: var(--wb-bg-pill-active);\n  color: var(--wb-text-white);\n}\n.um-tab--active svg {\n  color: var(--wb-text-white);\n}\n.um-tab--active svg path {\n  fill: var(--wb-text-white);\n}\n.um-tab--active:hover {\n  color: var(--wb-text-white);\n}\n.ec-picker-panel {\n  --ec-bg-primary: var(--wb-bg-primary);\n  --ec-bg-secondary: var(--wb-bg-secondary);\n  --ec-bg-tertiary: var(--wb-bg-tertiary);\n  --ec-bg-hover: var(--wb-bg-hover);\n  --ec-bg-active: var(--wb-bg-active);\n  --ec-text-primary: var(--wb-color-text-primary);\n  --ec-text-secondary: var(--wb-color-text-secondary);\n  --ec-text-tertiary: var(--wb-color-text-tertiary);\n  --ec-text-placeholder: var(--wb-color-text-disabled);\n  --ec-text-desc: var(--wb-color-text-secondary);\n  --ec-text-usage: var(--wb-color-text-tertiary);\n  --ec-text-use-count: var(--wb-color-text-tertiary);\n  --ec-text-category-tab: var(--wb-color-text-secondary);\n  --ec-text-contrast: var(--wb-text-on-primary);\n  --ec-text-soft: var(--wb-color-text-secondary);\n  --ec-text-strong: var(--wb-color-text-primary);\n  --ec-text-muted: var(--wb-color-text-tertiary);\n  --ec-expert-card-bg: var(--wb-bg-secondary);\n  --ec-expert-card-hover-bg: var(--wb-bg-tertiary);\n  --ec-expert-card-hover-border: var(--wb-color-border-primary);\n  --ec-expert-card-avatar-bg: var(--wb-bg-tertiary);\n  --ec-expert-card-shadow: none;\n  --ec-expert-card-desc-color: var(--wb-color-text-secondary);\n  --ec-card-tag-bg: var(--wb-bg-tertiary);\n  --ec-card-tag-border: var(--wb-color-border-secondary);\n  --ec-card-tag-color: var(--wb-color-text-secondary);\n  --ec-filter-border: var(--wb-color-border-secondary);\n  --ec-filter-text: var(--wb-color-text-secondary);\n  --ec-filter-text-hover: var(--wb-color-text-primary);\n  --ec-filter-text-active: var(--wb-color-text-primary);\n  --ec-primary: var(--wb-color-text-primary);\n  --ec-primary-light: var(--wb-bg-tertiary);\n  --ec-primary-shadow: var(--wb-bg-active);\n  --ec-border: var(--wb-color-border-secondary);\n  --ec-border-light: var(--wb-color-border-secondary);\n  --ec-border-hover: var(--wb-color-border-primary);\n  --ec-border-subtle: var(--wb-color-border-secondary);\n  --ec-card-bg: var(--wb-bg-secondary);\n  --ec-modal-bg: var(--wb-bg-popover);\n  --ec-card-border-static: var(--wb-color-border-secondary);\n  --ec-card-shadow: none;\n  --ec-card-shadow-hover: none;\n  --ec-card-border-hover: var(--wb-color-border-primary);\n  --ec-surface-muted: var(--wb-bg-secondary);\n  --ec-surface-subtle: var(--wb-bg-tertiary);\n  --ec-surface-hover: var(--wb-bg-hover);\n  display: flex;\n  flex-direction: column;\n  width: min(1060px, calc(100vw - 48px));\n  height: min(780px, calc(100vh - 90px));\n  border-radius: 16px;\n  border: 1px solid var(--wb-color-border-secondary);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-xl);\n  overflow: hidden;\n  animation: ec-picker-scale-in .2s ease-out;\n}\n.ec-picker-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 54px;\n  padding: 0 20px;\n  border-bottom: 1px solid var(--wb-border-card);\n  flex-shrink: 0;\n}\n.ec-picker-header-right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.ec-picker-header-right .ec-search-wrapper {\n  width: 220px;\n}\n.ec-picker-panel .ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-category-tab.is-active {\n  background: var(--wb-bg-active);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-expert-card {\n  border-color: var(--wb-color-border-secondary);\n}\n.ec-expert-card--selectable {\n  cursor: pointer;\n  transition:\n    border-color .15s,\n    box-shadow .15s,\n    background .15s;\n}\n.ec-expert-card--selectable:hover:not(.ec-expert-card--selected) {\n  border-color: var(--wb-color-border-primary);\n}\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected,\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected:hover {\n  border-color: var(--wb-button-primary-bg);\n  box-shadow: 0 0 0 1px var(--wb-button-primary-bg);\n  background: var(--wb-bg-tertiary);\n  transform: none;\n}\n.ec-expert-card--disabled {\n  opacity: .5;\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.ec-category-tabs,\n.ec-expert-grid {\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-category-tabs::-webkit-scrollbar,\n.ec-expert-grid::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n}\n.ec-category-tabs::-webkit-scrollbar-track,\n.ec-expert-grid::-webkit-scrollbar-track {\n  background: transparent;\n  border-radius: 2px;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb,\n.ec-expert-grid::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 2px;\n  transition: background .2s ease;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb:hover,\n.ec-expert-grid::-webkit-scrollbar-thumb:hover {\n  background: var(--wb-bg-tertiary);\n}\n.ec-category-tabs::-webkit-scrollbar-corner,\n.ec-expert-grid::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.ec-category-tabs-wrap {\n  position: relative;\n  margin-bottom: 12px;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-category-tabs {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  width: 100%;\n  flex-wrap: nowrap;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 0 0 2px;\n  cursor: grab;\n  user-select: none;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n  -webkit-overflow-scrolling: touch;\n  -webkit-mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n  mask-image:\n    linear-gradient(\n      90deg,\n      #000 0,\n      #000 calc(100% - 32px),\n      transparent 100%);\n}\n.ec-category-tabs.is-dragging,\n.ec-category-tabs.is-dragging * {\n  cursor: grabbing;\n}\n.ec-category-tabs::-webkit-scrollbar {\n  display: none;\n}\n.ec-category-tabs-next {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: var(--wb-bg-tertiary);\n  color: var(--wb-text-muted);\n  cursor: pointer;\n}\n.ec-category-tabs-next-icon {\n  width: 7px;\n  height: 7px;\n  border-top: 2px solid currentColor;\n  border-right: 2px solid currentColor;\n  transform: translate(-1px) rotate(45deg);\n}\n.ec-category-tab {\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  cursor: pointer;\n  padding: 4px 12px;\n  height: 28px;\n  border-radius: 6px;\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n}\n.ec-category-tab.is-active {\n  background: var(--wb-bg-inset-strong);\n  color: var(--wb-color-text-primary);\n  font-weight: 600;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n.ec-expert-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(288px, 1fr));\n  gap: 12px;\n  align-content: start;\n}\n.ec-expert-card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-height: 154px;\n  padding: 16px 20px;\n  background: var(--wb-bg-card);\n  border: 1px solid var(--wb-border-card-static);\n  border-radius: 16px;\n  cursor: pointer;\n  transition:\n    box-shadow .2s ease,\n    transform .2s ease,\n    background .2s ease,\n    border-color .2s ease;\n  position: relative;\n  overflow: hidden;\n  box-shadow: var(--wb-shadow-card-soft);\n  box-sizing: border-box;\n  opacity: 0;\n  transform: translateY(4px);\n  animation-delay: var(--delay, 0s);\n  animation: fadeInUp .25s ease forwards;\n}\n.ec-expert-card:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default), var(--wb-shadow-card-soft);\n}\n.ec-expert-card:hover {\n  background: var(--wb-bg-card-hover);\n  border-color: var(--wb-border-default);\n  box-shadow: var(--wb-shadow-card-soft);\n  transform: translateY(0);\n}\n.ec-card-main {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.ec-card-main:focus-visible {\n  box-shadow: 0 0 0 2px var(--wb-border-default);\n}\n.ec-card-head {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n}\n.ec-card-avatar-sq {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  background: var(--wb-avatar-bg-accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ec-card-avatar-sq img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-card-body {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  flex-direction: column;\n  gap: 2px;\n}\n.ec-card-title-row {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 4px;\n  min-width: 0;\n}\n.ec-card-tags {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-wrap: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n.ec-card-tag {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 20px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ec-card-subtitle {\n  color: var(--wb-color-text-primary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 16px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-role-wrap {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n}\n.ec-card-role {\n  flex: 0 1 auto;\n  min-width: 0;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--wb-color-text-primary);\n  line-height: 20px;\n  letter-spacing: 0;\n  margin-bottom: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-card-desc {\n  width: 100%;\n  color: var(--wb-color-text-secondary);\n  font-size: 11px;\n  font-weight: 400;\n  line-height: 18px;\n  display: -webkit-box;\n  line-clamp: 2;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  min-height: 36px;\n}\n.ec-card-summon-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 24px;\n  padding: 0 10px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 24px;\n  white-space: nowrap;\n  flex-shrink: 0;\n  box-shadow: none;\n  cursor: pointer;\n  transition: background .15s ease, color .15s ease;\n  outline: none;\n}\n.ec-card-summon-btn--top {\n  position: absolute;\n  top: 16px;\n  right: 20px;\n  z-index: 2;\n  opacity: 0;\n  pointer-events: none;\n  transition:\n    opacity .15s ease,\n    background .15s ease,\n    color .15s ease;\n}\n.ec-card-summon-btn--top:before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 100%;\n  width: 40px;\n  height: 100%;\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      var(--wb-bg-card));\n  pointer-events: none;\n}\n.ec-expert-card:hover .ec-card-summon-btn--top:before,\n.ec-expert-card:focus-within .ec-card-summon-btn--top:before {\n  background:\n    linear-gradient(\n      to right,\n      transparent,\n      color-mix(in srgb, var(--wb-palette-black-100) 5%, var(--wb-bg-card)));\n}\n.ec-expert-card:hover .ec-card-summon-btn--top,\n.ec-expert-card:focus-within .ec-card-summon-btn--top {\n  opacity: 1;\n  pointer-events: auto;\n}\n.ec-card-summon-btn:hover {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n}\n.ec-card-summon-btn:focus,\n.ec-card-summon-btn:focus-visible,\n.ec-card-summon-btn:active {\n  background: var(--wb-button-primary-bg-hover);\n  color: var(--wb-button-primary-fg);\n  border-color: transparent;\n  box-shadow: none;\n  transform: none;\n  outline: none;\n}\n.ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-inset-strong);\n  border-color: var(--wb-border-card);\n}\n.ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-category-tabs {\n  padding: 0 var(--ec-page-gutter);\n}\n.ec-category-tab {\n  padding: 4px 10px;\n  font-size: 12px;\n}\n.ec-modal-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  background: var(--wb-color-mask-color);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  animation: ec-overlay-in .15s ease;\n}\n.ec-modal-card {\n  background: var(--wb-bg-primary);\n  border-radius: 16px;\n  width: 520px;\n  max-width: 90vw;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: var(--wb-shadow-dialog-md);\n  opacity: 0;\n  transition: opacity .12s ease-out;\n  position: relative;\n  overflow: hidden;\n  animation: ec-modal-in .2s ease forwards;\n}\n.ec-modal-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 0 20px;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-modal-body::-webkit-scrollbar {\n  width: 4px;\n}\n.ec-modal-body::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 999px;\n}\n.ec-modal-close {\n  position: absolute;\n  top: 18px;\n  right: 18px;\n  width: 24px;\n  height: 24px;\n  border: none;\n  border-radius: var(--wb-radius-md);\n  background: transparent;\n  color: var(--wb-text-muted);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background .15s ease, color .15s ease;\n}\n.ec-modal-close:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-modal-top {\n  display: flex;\n  align-items: flex-start;\n  flex-shrink: 0;\n  gap: 12px;\n  margin-bottom: 14px;\n  padding: 22px 52px 0 20px;\n}\n.ec-modal-avatar {\n  width: 76px;\n  height: 76px;\n  border-radius: 12px;\n  overflow: hidden;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ec-modal-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-modal-avatar-fallback {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--wb-button-primary-fg);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--wb-avatar-bg-fallback-6),\n      var(--wb-avatar-bg-fallback-2));\n}\n.ec-modal-info {\n  flex: 1;\n  min-width: 0;\n}\n.ec-modal-title-row {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n  min-width: 0;\n}\n.ec-modal-role {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--wb-color-text-primary);\n  line-height: 1.3;\n  letter-spacing: -.02em;\n  margin: 0;\n}\n.ec-modal-meta {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 6px;\n  min-width: 0;\n  margin-top: 4px;\n}\n.ec-modal-name {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--wb-color-text-secondary);\n  line-height: 18px;\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.ec-modal-type-badge {\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 4px;\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 20px;\n}\n.ec-modal-category-badge {\n  display: inline-flex;\n  align-items: center;\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 11px;\n  font-weight: 500;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-color-text-secondary);\n}\n.ec-modal-use-count-row {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  margin-top: 4px;\n}\n.ec-modal-use-count {\n  display: inline-flex;\n  align-items: center;\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n  font-weight: 500;\n  line-height: 20px;\n}\n.ec-modal-content,\n.ec-modal-tags-section {\n  margin-bottom: 18px;\n}\n.ec-modal-tags-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.ec-modal-tag-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 0 12px;\n  border-radius: 6px;\n  font-size: 12px;\n  line-height: 1;\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-secondary);\n  border: 1px solid var(--wb-border-weak);\n  height: 30px;\n  box-sizing: border-box;\n  white-space: nowrap;\n}\n.ec-modal-quick-prompts {\n  margin-bottom: 16px;\n}\n.ec-modal-quick-prompts-list {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.ec-modal-quick-prompt-btn {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  text-align: left;\n  font-size: 13px;\n  color: var(--wb-color-text-secondary);\n  line-height: 1.5;\n  cursor: pointer;\n  padding: 10px 14px;\n  background: var(--wb-bg-hover);\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--wb-border-weak);\n  border-image: initial;\n  border-radius: 8px;\n  transition: background .12s;\n  gap: 12px;\n}\n.ec-modal-quick-prompt-btn:hover {\n  background: var(--wb-bg-active);\n}\n.ec-modal-quick-prompt-text {\n  flex: 1;\n  min-width: 0;\n  font-size: inherit;\n  line-height: inherit;\n  color: inherit;\n}\n.ec-modal-section-title {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--wb-color-text-tertiary);\n  margin-bottom: 8px;\n}\n.ec-modal-desc {\n  font-size: 13px;\n  line-height: 1.6;\n  color: var(--wb-color-text-secondary);\n  margin: 0;\n}\n.ec-modal-footer {\n  display: flex;\n  justify-content: center;\n  flex-shrink: 0;\n  padding: 16px 20px 20px;\n  border-top: 1px solid var(--wb-border-default);\n  background: var(--wb-bg-primary);\n}\n.ec-modal-summon-btn {\n  width: 100%;\n  height: 42px;\n  padding: 0 24px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition:\n    background .15s ease,\n    opacity .15s ease,\n    transform .15s ease;\n  letter-spacing: .2px;\n}\n.ec-modal-summon-btn:hover {\n  background: var(--wb-button-primary-bg-hover);\n  opacity: .96;\n}\n.ec-modal-summon-btn:active {\n  transform: translateY(0);\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  margin-left: auto;\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  width: 100%;\n  flex-basis: 100%;\n}\n.expert-import-modal-card .ec-modal-close:disabled,\n.expert-import-modal-card .ec-modal-summon-btn:disabled {\n  cursor: not-allowed;\n  opacity: .7;\n}\n.ec-search-wrapper {\n  width: 200px;\n  min-width: 160px;\n}\n.ec-modal-card.is-expert-view {\n  border: .5px solid #dedede;\n  box-shadow: var(--wb-shadow-dialog);\n}\n.ec-modal-card.is-expert-view .ec-modal-close:hover {\n  background: var(--wb-palette-gray-2);\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n  margin-left: auto;\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-card .ec-modal-top {\n  align-items: center;\n  gap: var(--wb-spacing-7);\n  margin-bottom: var(--wb-spacing-6);\n  padding: var(--wb-spacing-7) var(--wb-spacing-6) 0 var(--wb-spacing-7);\n}\n.ec-modal-card .ec-modal-avatar {\n  width: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  height: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  border-radius: 50%;\n}\n.ec-modal-card .ec-modal-role {\n  flex: 1;\n  min-width: 0;\n  display: block;\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h2-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-h2-line-height);\n  letter-spacing: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-role-secondary {\n  color: var(--wb-palette-black-60);\n}\n.ec-modal-role-separator {\n  width: calc(var(--wb-spacing-1) / 2);\n  height: var(--wb-font-caption-line-height);\n  margin: 0 var(--wb-spacing-3);\n  flex-shrink: 0;\n  display: inline-block;\n  object-fit: fill;\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.ec-modal-scroll-shell {\n  position: relative;\n  flex: 1;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.ec-modal-card .ec-modal-body {\n  padding: 0 var(--wb-spacing-7) var(--wb-spacing-7);\n}\n.ec-modal-scroll-shell.has-top-fade .ec-modal-scroll-fade-top,\n.ec-modal-scroll-shell.has-bottom-fade .ec-modal-scroll-fade-bottom {\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-content {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-desc {\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n}\n.ec-modal-card .ec-modal-tags-list {\n  gap: var(--wb-spacing-3);\n  margin-top: var(--wb-spacing-5);\n}\n.ec-modal-card .ec-modal-tag-chip {\n  height: var(--wb-spacing-7);\n  padding: 0 calc(var(--wb-spacing-3) + var(--wb-spacing-1));\n  border: 0;\n  border-radius: var(--wb-radius-md);\n  background: var(--wb-palette-gray-3);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-caption-size);\n}\n.ec-modal-card .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-1);\n}\n.ec-modal-section-title-with-icon {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary, rgba(0, 0, 0, .9));\n  font-family: PingFang SC;\n  font-size: var(--wb-font-h3-size);\n  font-weight: var(--wb-font-h3-weight);\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card .ec-modal-quick-prompts {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-quick-prompts:last-child {\n  margin-bottom: 0;\n}\n.ec-modal-quick-prompts-panel {\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-9) var(--wb-spacing-7);\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n  margin-top: var(--wb-spacing-5);\n  border-radius: var(--wb-radius-xl);\n  background: var(--wb-bg-secondary);\n}\n.ec-modal-card .ec-modal-quick-prompts-list {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  width: auto;\n  max-width: 100%;\n  min-height: calc(var(--wb-spacing-9) + var(--wb-spacing-1));\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  align-items: center;\n  border: 0;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-card-soft);\n  gap: var(--wb-spacing-4);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-code-size);\n  line-height: var(--wb-font-code-line-height);\n}\n.ec-modal-quick-prompt-btn-1,\n.ec-modal-quick-prompt-btn-3 {\n  transform: none;\n}\n.ec-modal-quick-prompt-btn-2 {\n  width: calc(100% - var(--wb-spacing-10));\n  transform: none;\n}\n.ec-modal-card .ec-modal-quick-prompt-text {\n  color: inherit;\n  white-space: normal;\n}\n.ec-modal-card .ec-modal-quick-prompt-text strong {\n  margin-right: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary);\n  font-weight: 700;\n}\n.ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n}\n.ec-modal-quick-prompts > .ec-modal-section-title {\n  margin-bottom: 0;\n}\n.ec-modal-quick-prompts-panel {\n  --ec-qpc-panel-padding-block: var(--wb-spacing-9);\n  --ec-qpc-panel-padding-inline: var(--wb-spacing-7);\n  --ec-qpc-bubble-padding-block: calc(var(--wb-spacing-4) - var(--wb-spacing-1) / 2);\n  --ec-qpc-bubble-padding-inline: var(--wb-spacing-5);\n  --ec-qpc-bubble-gap: var(--wb-spacing-4);\n  --ec-qpc-bubble-radius: var(--wb-radius-2xl);\n  --ec-qpc-bubble-shadow: var(--wb-shadow-card-soft);\n  --ec-qpc-content-gap: var(--wb-spacing-4);\n  --ec-qpc-slot-height: calc(var(--wb-spacing-10) + var(--wb-spacing-2));\n  --ec-qpc-static-height: calc(var(--ec-qpc-slot-height) * 3 + var(--ec-qpc-bubble-gap) * 2);\n  --ec-qpc-shadow-safe-x: var(--wb-spacing-4);\n  --ec-qpc-shadow-safe-y: var(--wb-spacing-7);\n  --ec-qpc-edge-opacity: .78;\n  --ec-qpc-focus-scale: 1.018;\n  flex-shrink: 0;\n  display: flex;\n  padding: 0;\n  flex-direction: column;\n  justify-content: center;\n  align-items: stretch;\n  gap: var(--wb-spacing-5);\n  margin-top: var(--wb-spacing-5);\n  border-radius: 0;\n  background: transparent;\n  position: relative;\n}\n.ec-modal-quick-prompts-stack {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-quick-prompts-stack .ec-modal-quick-prompt-slot {\n  height: auto;\n}\n.ec-modal-quick-prompts-carousel-stage {\n  position: relative;\n  width: 100%;\n  height: var(--ec-qpc-static-height);\n  overflow: visible;\n  isolation: isolate;\n}\n.ec-modal-quick-prompts-viewport {\n  position: absolute;\n  inset-block: calc(0px - var(--ec-qpc-shadow-safe-y));\n  inset-inline: calc(0px - var(--ec-qpc-shadow-safe-x));\n  padding-block: var(--ec-qpc-shadow-safe-y);\n  padding-inline: var(--ec-qpc-shadow-safe-x);\n  overflow: hidden;\n  pointer-events: auto;\n}\n.ec-modal-quick-prompts-viewport:before,\n.ec-modal-quick-prompts-viewport:after {\n  content: \"\";\n  position: absolute;\n  left: var(--ec-qpc-shadow-safe-x);\n  right: var(--ec-qpc-shadow-safe-x);\n  z-index: 4;\n  height: var(--ec-qpc-shadow-safe-y);\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-viewport:before {\n  top: 0;\n  background:\n    linear-gradient(\n      180deg,\n      var(--wb-bg-secondary) 0%,\n      transparent 100%);\n}\n.ec-modal-quick-prompts-viewport:after {\n  bottom: 0;\n  background:\n    linear-gradient(\n      0deg,\n      var(--wb-bg-secondary) 0%,\n      transparent 100%);\n}\n.ec-modal-quick-prompts-track {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--ec-qpc-bubble-gap);\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(.42, 0, .58, 1);\n  will-change: transform;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-hidden {\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-focused,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot:hover,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot:focus-within {\n  --ec-qpc-slot-focus: 1;\n  --ec-qpc-slot-focus-scale: var(--ec-qpc-focus-scale);\n  opacity: 1;\n  z-index: 6;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn {\n  width: 100%;\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-5);\n  border: .5px solid transparent;\n  background: var(--wb-palette-gray-2);\n  border-radius: var(--wb-radius-2xl);\n  box-shadow: none;\n  color: var(--wb-color-text-secondary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: var(--wb-font-body-weight);\n  font-style: normal;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n  text-align: left;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), border-color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-btn,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-btn {\n  background: var(--wb-palette-gray-3);\n  border-color: var(--ec-modal-quick-prompt-border);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:focus-visible {\n  outline: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-focus);\n  outline-offset: calc(var(--wb-spacing-1) / 2);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-text {\n  min-width: 0;\n  flex: 1;\n  display: -webkit-box;\n  color: inherit;\n  white-space: normal;\n  overflow-wrap: anywhere;\n  overflow: hidden;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n  color: var(--wb-palette-black-50);\n  transition: color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-action {\n  color: var(--wb-palette-black-70);\n}\n.ec-modal-quick-prompts-track,\n.ec-modal-quick-prompt-slot,\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  transition: none !important;\n}\n.ec-modal-cases-section .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-5);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  height: calc(var(--wb-spacing-12) * 2 + var(--wb-spacing-6) + var(--wb-spacing-3));\n  padding: 0;\n  box-sizing: border-box;\n  border: .5px solid #dedede;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  overflow: hidden;\n  transition: border-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), background-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card:hover {\n  border-color: #dedede;\n  background: var(--wb-palette-gray-3);\n}\n.ec-modal-team .ec-modal-section-title {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(var(--wb-spacing-2) + var(--wb-spacing-1));\n  margin-bottom: var(--wb-spacing-5);\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h3-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card {\n  width: min(calc(var(--wb-spacing-12) * 10), calc(100vw - var(--wb-spacing-9)));\n  max-width: none;\n  height: auto;\n  max-height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n  transition: opacity var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), height var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view {\n  height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n  max-height: min(calc(var(--wb-spacing-12) * 10), calc(100vh - var(--wb-spacing-12)));\n}\n.ec-modal-card.is-case-view:has(.dc-detail-page.is-enlarged) {\n  width: min(calc(var(--wb-spacing-12) * 15), calc(100vw - var(--wb-spacing-8)));\n  height: min(calc(var(--wb-spacing-12) * 11 + var(--wb-spacing-5)), calc(100vh - var(--wb-spacing-12) - var(--wb-spacing-5)));\n  max-height: calc(100vh - var(--wb-spacing-12) - var(--wb-spacing-5));\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: var(--wb-spacing-8);\n  padding: 0 var(--wb-spacing-5);\n  border: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-default);\n  border-radius: var(--wb-radius-lg);\n  background: var(--wb-bg-primary);\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-code-line-height);\n  font-weight: 400;\n  font-family: inherit;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn {\n  pointer-events: auto;\n  border: none;\n  outline: calc(var(--wb-spacing-1) / 2) solid color-mix(in srgb, var(--wb-text-on-inverse) 20%, transparent);\n  outline-offset: 0;\n  color: var(--wb-text-on-inverse);\n  background: color-mix(in srgb, var(--wb-bg-inverse) 80%, transparent);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn:hover:not(:disabled) {\n  opacity: 1;\n  background: color-mix(in srgb, var(--wb-bg-inverse) 95%, transparent);\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.connector-panel .ec-search-wrapper {\n  position: relative;\n  width: 220px;\n  min-width: 120px;\n  flex: 0 1 220px;\n}\n.connector-panel .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-picker-header-right .ec-search-wrapper {\n  width: 220px;\n}\n.ec-picker-panel .ec-category-tab:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-category-tab.is-active {\n  background: var(--wb-bg-active);\n  color: var(--wb-color-text-primary);\n}\n.ec-picker-panel .ec-expert-card {\n  border-color: var(--wb-color-border-secondary);\n}\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected,\n.ec-picker-panel .ec-expert-card.ec-expert-card--selected:hover {\n  border-color: var(--wb-button-primary-bg);\n  box-shadow: 0 0 0 1px var(--wb-button-primary-bg);\n  background: var(--wb-bg-tertiary);\n  transform: none;\n}\n.ec-category-tabs,\n.ec-expert-grid {\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-category-tabs::-webkit-scrollbar,\n.ec-expert-grid::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n}\n.ec-category-tabs::-webkit-scrollbar-track,\n.ec-expert-grid::-webkit-scrollbar-track {\n  background: transparent;\n  border-radius: 2px;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb,\n.ec-expert-grid::-webkit-scrollbar-thumb {\n  background: var(--wb-border-default);\n  border-radius: 2px;\n  transition: background .2s ease;\n}\n.ec-category-tabs::-webkit-scrollbar-thumb:hover,\n.ec-expert-grid::-webkit-scrollbar-thumb:hover {\n  background: var(--wb-bg-tertiary);\n}\n.ec-category-tabs::-webkit-scrollbar-corner,\n.ec-expert-grid::-webkit-scrollbar-corner {\n  background: transparent;\n}\n.ec-category-tabs.is-dragging,\n.ec-category-tabs.is-dragging * {\n  cursor: grabbing;\n}\n.ec-category-tab.is-active .ec-expert-count {\n  color: var(--wb-color-text-secondary);\n}\n.ec-search-wrapper .wb-input-wrapper {\n  background: var(--wb-bg-inset-strong);\n  border-color: var(--wb-border-card);\n}\n.ec-search-wrapper .wb-input-wrapper:hover:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-hover);\n}\n.ec-search-wrapper .wb-input-wrapper:focus-within:not(.wb-input-wrapper--disabled) {\n  border-color: var(--wb-border-popover-strong);\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  margin-left: auto;\n}\n.ec-my-created-toolbar .ec-search-wrapper {\n  width: 100%;\n  flex-basis: 100%;\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.skills-view .ec-search-wrapper {\n  position: relative;\n  width: 200px;\n  min-width: 120px;\n  flex: 0 1 200px;\n}\n.skills-view .ec-search-wrapper {\n  width: 100%;\n  min-width: 0;\n  flex-shrink: 1;\n}\n.ec-modal-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.ec-modal-content,\n.ec-modal-tags-section {\n  margin-bottom: 18px;\n}\n.expert-import-modal-card .ec-modal-close:disabled,\n.expert-import-modal-card .ec-modal-summon-btn:disabled {\n  cursor: not-allowed;\n  opacity: .7;\n}\n.ec-modal-card.is-expert-view .ec-modal-close:hover {\n  background: var(--wb-palette-gray-2);\n}\n.ec-modal-card .ec-modal-title-row {\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  width: 100%;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-actions .ec-modal-close {\n  position: static;\n  flex-shrink: 0;\n}\n.ec-modal-actions .ec-modal-use-count {\n  flex-shrink: 0;\n  color: var(--wb-color-text-tertiary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: 400;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n  white-space: nowrap;\n}\n.ec-modal-card .ec-modal-top {\n  align-items: center;\n  gap: var(--wb-spacing-7);\n  margin-bottom: var(--wb-spacing-6);\n  padding: var(--wb-spacing-7) var(--wb-spacing-6) 0 var(--wb-spacing-7);\n}\n.ec-modal-card .ec-modal-avatar {\n  width: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  height: calc(var(--wb-spacing-12) + var(--wb-spacing-2));\n  border-radius: 50%;\n}\n.ec-modal-card .ec-modal-role {\n  flex: 1;\n  min-width: 0;\n  display: block;\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h2-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-h2-line-height);\n  letter-spacing: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ec-modal-role-primary,\n.ec-modal-role-secondary {\n  vertical-align: middle;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  width: auto;\n  min-width: calc(var(--wb-spacing-12) + var(--wb-spacing-10) + var(--wb-spacing-2));\n  height: var(--wb-spacing-8);\n  margin-top: var(--wb-spacing-4);\n  flex-shrink: 0;\n  display: flex;\n  padding: 0 var(--wb-spacing-7);\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-2);\n  background: var(--wb-bg-inverse);\n  border-radius: var(--wb-radius-lg);\n  font-family: PingFang SC;\n  font-size: var(--wb-font-body-size);\n  font-weight: 500;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn:hover {\n  background: color-mix(in srgb, var(--wb-palette-black-100) 80%, var(--wb-palette-gray-4));\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-body {\n  padding: 0 var(--wb-spacing-7) var(--wb-spacing-7);\n}\n.ec-modal-scroll-shell.has-top-fade .ec-modal-scroll-fade-top,\n.ec-modal-scroll-shell.has-bottom-fade .ec-modal-scroll-fade-bottom {\n  opacity: 1;\n}\n.ec-modal-card .ec-modal-content {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-desc {\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n}\n.ec-modal-card .ec-modal-tags-list {\n  gap: var(--wb-spacing-3);\n  margin-top: var(--wb-spacing-5);\n}\n.ec-modal-card .ec-modal-tag-chip {\n  height: var(--wb-spacing-7);\n  padding: 0 calc(var(--wb-spacing-3) + var(--wb-spacing-1));\n  border: 0;\n  border-radius: var(--wb-radius-md);\n  background: var(--wb-palette-gray-3);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-caption-size);\n}\n.ec-modal-card .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-1);\n}\n.ec-modal-card .ec-modal-quick-prompts {\n  margin-bottom: var(--wb-spacing-8);\n}\n.ec-modal-card .ec-modal-quick-prompts:last-child {\n  margin-bottom: 0;\n}\n.ec-modal-card .ec-modal-quick-prompts-list {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--wb-spacing-4);\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  width: auto;\n  max-width: 100%;\n  min-height: calc(var(--wb-spacing-9) + var(--wb-spacing-1));\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  align-items: center;\n  border: 0;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  box-shadow: var(--wb-shadow-card-soft);\n  gap: var(--wb-spacing-4);\n  color: var(--wb-color-text-secondary);\n  font-size: var(--wb-font-code-size);\n  line-height: var(--wb-font-code-line-height);\n}\n.ec-modal-quick-prompt-btn-1,\n.ec-modal-quick-prompt-btn-3 {\n  transform: none;\n}\n.ec-modal-card .ec-modal-quick-prompt-text {\n  color: inherit;\n  white-space: normal;\n}\n.ec-modal-card .ec-modal-quick-prompt-text strong {\n  margin-right: var(--wb-spacing-2);\n  color: var(--wb-color-text-primary);\n  font-weight: 700;\n}\n.ec-modal-quick-prompts-stack .ec-modal-quick-prompt-slot {\n  height: auto;\n}\n.ec-modal-quick-prompts-viewport:before,\n.ec-modal-quick-prompts-viewport:after {\n  content: \"\";\n  position: absolute;\n  left: var(--ec-qpc-shadow-safe-x);\n  right: var(--ec-qpc-shadow-safe-x);\n  z-index: 4;\n  height: var(--ec-qpc-shadow-safe-y);\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-hidden {\n  pointer-events: none;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompt-slot.is-focused,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot:hover,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot:focus-within {\n  --ec-qpc-slot-focus: 1;\n  --ec-qpc-slot-focus-scale: var(--ec-qpc-focus-scale);\n  opacity: 1;\n  z-index: 6;\n}\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:hover) .ec-modal-quick-prompt-slot,\n.ec-modal-quick-prompts-panel.is-carousel .ec-modal-quick-prompts-stack:has(.ec-modal-quick-prompt-slot:focus-within) .ec-modal-quick-prompt-slot {\n  opacity: var(--ec-qpc-edge-opacity);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn {\n  width: 100%;\n  flex-shrink: 0;\n  display: flex;\n  padding: var(--wb-spacing-4) var(--wb-spacing-5);\n  box-sizing: border-box;\n  justify-content: center;\n  align-items: center;\n  gap: var(--wb-spacing-5);\n  border: .5px solid transparent;\n  background: var(--wb-palette-gray-2);\n  border-radius: var(--wb-radius-2xl);\n  box-shadow: none;\n  color: var(--wb-color-text-secondary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-body-size);\n  font-weight: var(--wb-font-body-weight);\n  font-style: normal;\n  line-height: var(--wb-font-body-line-height);\n  letter-spacing: 0;\n  text-align: left;\n  cursor: pointer;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), border-color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-btn,\n.ec-modal-card.is-expert-view .ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-btn {\n  background: var(--wb-palette-gray-3);\n  border-color: var(--ec-modal-quick-prompt-border);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:focus-visible {\n  outline: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-focus);\n  outline-offset: calc(var(--wb-spacing-1) / 2);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-text {\n  min-width: 0;\n  flex: 1;\n  display: -webkit-box;\n  color: inherit;\n  white-space: normal;\n  overflow-wrap: anywhere;\n  overflow: hidden;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-action {\n  width: var(--wb-spacing-5);\n  height: var(--wb-spacing-5);\n  flex-shrink: 0;\n  display: block;\n  color: var(--wb-palette-black-50);\n  transition: color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-btn:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:hover .ec-modal-quick-prompt-action,\n.ec-modal-quick-prompts-panel .ec-modal-quick-prompt-slot:focus-within .ec-modal-quick-prompt-action {\n  color: var(--wb-palette-black-70);\n}\n.ec-modal-quick-prompts-track,\n.ec-modal-quick-prompt-slot,\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  transition: none !important;\n}\n.ec-modal-cases-section .ec-modal-section-title {\n  margin-bottom: var(--wb-spacing-5);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  height: calc(var(--wb-spacing-12) * 2 + var(--wb-spacing-6) + var(--wb-spacing-3));\n  padding: 0;\n  box-sizing: border-box;\n  border: .5px solid #dedede;\n  border-radius: var(--wb-radius-2xl);\n  background: var(--wb-bg-primary);\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  overflow: hidden;\n  transition: border-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard), background-color var(--wb-motion-duration-fast) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-expert-view .ec-modal-case-card:hover {\n  border-color: #dedede;\n  background: var(--wb-palette-gray-3);\n}\n.ec-modal-team .ec-modal-section-title {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(var(--wb-spacing-2) + var(--wb-spacing-1));\n  margin-bottom: var(--wb-spacing-5);\n  color: var(--wb-color-text-primary);\n  font-family: var(--wb-font-family, \"PingFang SC\");\n  font-size: var(--wb-font-h3-size);\n  font-weight: 600;\n  font-style: normal;\n  text-decoration-line: none;\n  line-height: normal;\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: var(--wb-spacing-8);\n  padding: 0 var(--wb-spacing-5);\n  border: calc(var(--wb-spacing-1) / 2) solid var(--wb-border-default);\n  border-radius: var(--wb-radius-lg);\n  background: var(--wb-bg-primary);\n  color: var(--wb-color-text-primary);\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-code-line-height);\n  font-weight: 400;\n  font-family: inherit;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background var(--wb-motion-duration-sm) var(--wb-motion-easing-standard), color var(--wb-motion-duration-sm) var(--wb-motion-easing-standard);\n}\n.ec-modal-card.is-case-view .dc-detail-secondary-btn:hover:not(:disabled) {\n  background: var(--wb-bg-hover);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn {\n  pointer-events: auto;\n  border: none;\n  outline: calc(var(--wb-spacing-1) / 2) solid color-mix(in srgb, var(--wb-text-on-inverse) 20%, transparent);\n  outline-offset: 0;\n  color: var(--wb-text-on-inverse);\n  background: color-mix(in srgb, var(--wb-bg-inverse) 80%, transparent);\n}\n.ec-modal-card.is-case-view .dc-detail-page.is-enlarged .dc-detail-secondary-btn:hover:not(:disabled) {\n  opacity: 1;\n  background: color-mix(in srgb, var(--wb-bg-inverse) 95%, transparent);\n}\n.workbuddy-topbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 56px;\n  min-height: 56px;\n  flex-shrink: 0;\n  padding: 0 12px 0 16px;\n  box-sizing: border-box;\n  -webkit-app-region: drag;\n  position: sticky;\n  top: 0;\n  width: 100%;\n  z-index: 101;\n  transition: margin-top .18s cubic-bezier(.05, .7, .1, 1);\n  gap: 8px;\n}\n.workbuddy-topbar {\n  height: 40px;\n  min-height: 40px;\n  padding: 0 8px 0 12px;\n}\n.workbuddy-topbar.workbuddy-topbar--preview-fullscreen {\n  margin-top: 4px;\n}\n.workbuddy-topbar .workbuddy-topbar-title {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-options {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  min-width: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-left {\n  display: flex;\n  align-items: center;\n  max-width: max-content;\n  gap: 4px;\n  min-width: 0;\n  flex: 1;\n  overflow: hidden;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-left .wb-button {\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-left:has(.workbuddy-topbar-claw) {\n  flex: 1;\n  min-width: 0px;\n  max-width: max-content;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac .ec-topbar__left {\n  gap: 4px;\n  margin-left: 72px;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac.workbuddy-topbar--fullscreen .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac.workbuddy-topbar--fullscreen .ec-topbar__left {\n  margin-left: 0;\n}\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac:has(.workbuddy-topbar-title--mac-offset) .workbuddy-topbar-left,\n.workbuddy-topbar.workbuddy-topbar--collapsed.workbuddy-topbar--mac:has(.workbuddy-topbar-title--mac-offset) .ec-topbar__left {\n  margin-left: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.workbuddy-topbar .workbuddy-topbar-actions .wb-button--icon-only {\n  color: var(--wb-color-text-secondary);\n}\n.workbuddy-topbar .workbuddy-topbar-actions .wb-button--icon-only:hover:not(:disabled) {\n  color: var(--wb-color-text-primary);\n}\n.workbuddy-topbar .workbuddy-topbar-logo {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  text-decoration: none;\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-logo:hover {\n  opacity: .8;\n}\n.workbuddy-topbar .workbuddy-topbar-logo img {\n  width: 24px;\n  height: 24px;\n  flex-shrink: 0;\n}\n.workbuddy-topbar .workbuddy-topbar-title {\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--wb-color-text-solid);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 24px;\n  height: 24px;\n  display: inline-block;\n  vertical-align: middle;\n}\n.workbuddy-topbar .workbuddy-topbar-title--workspace {\n  display: flex;\n  align-items: center;\n  height: 32px;\n  line-height: normal;\n  vertical-align: initial;\n}\n.workbuddy-topbar .workbuddy-topbar-title--mac-offset {\n  padding-left: 75px;\n}\n.workbuddy-topbar .workbuddy-topbar-title--workspace:has(.claw-workspace-title--peeking) {\n  width: 264px;\n  max-width: 264px;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb {\n  display: inline-flex;\n  align-items: center;\n  line-height: 24px;\n  height: 24px;\n  vertical-align: middle;\n  max-width: 100%;\n  min-width: 0;\n  overflow: hidden;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb .wb-breadcrumb__item:last-child {\n  max-width: 400px;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-root {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  color: var(--wb-color-text-tertiary);\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-last {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-last > span:first-child {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.workbuddy-topbar .workbuddy-topbar-breadcrumb-local-badge {\n  flex: 0 0 auto;\n  height: 18px;\n  padding: 0 6px;\n  display: inline-flex;\n  align-items: center;\n  border: 1px solid var(--wb-color-border-secondary, var(--cb-border-color, #555));\n  border-radius: 4px;\n  background: transparent;\n  color: var(--wb-color-text-secondary, var(--cb-text-secondary, #999));\n  font-size: 11px;\n  line-height: 1;\n  font-weight: 400;\n}\n.workbuddy-topbar .workbuddy-topbar-title-input {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n  background: transparent;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 4px;\n  padding: 2px 6px;\n  outline: none;\n  min-width: 120px;\n  max-width: 300px;\n  height: 24px;\n  line-height: 24px;\n  box-sizing: border-box;\n}\n.workbuddy-topbar .workbuddy-topbar-title-input:focus {\n  border-color: var(--wb-color-border-focus);\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button {\n  align-items: center;\n  justify-content: center;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 0;\n  color: var(--wb-color-text-secondary);\n  transition: opacity .15s ease;\n  flex-shrink: 0;\n  height: 24px;\n  display: none;\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button:hover {\n  color: var(--wb-color-text-primary);\n}\n.workbuddy-topbar .workbuddy-topbar-edit-button svg {\n  width: 14px;\n  height: 14px;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  overflow: hidden;\n  gap: 4px;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area .workbuddy-topbar-title {\n  min-width: 0;\n  flex-shrink: 1;\n}\n.workbuddy-topbar .workbuddy-topbar-title-area:hover .workbuddy-topbar-edit-button {\n  display: inline-flex;\n}\n.workbuddy-topbar--scrolled {\n  border-bottom: 1px solid var(--wb-color-border-tertiary);\n}\n.connector-panel .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.connector-panel .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  -webkit-app-region: no-drag;\n}\n.connector-panel .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  -webkit-app-region: no-drag;\n}\n.connector-panel .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.workbuddy-topbar-claw {\n  flex: 1;\n  flex-shrink: 1;\n  min-width: 0;\n  max-width: max-content;\n  overflow: hidden;\n}\n.workbuddy-topbar-claw-connected-info {\n  font-size: 14px;\n  color: var(--wb-color-text-tertiary);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n  cursor: default;\n  padding: 4px 8px;\n  border-radius: 6px;\n  transition: background .15s;\n  overflow: hidden;\n  min-width: 0;\n  -webkit-app-region: no-drag;\n  max-width: max-content;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-config-link {\n  color: var(--wb-claw-text-link);\n  text-decoration: none;\n  cursor: pointer;\n  font-weight: 500;\n  border-bottom: 1px solid transparent;\n  transition: border-color .2s, color .2s;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-config-link:hover {\n  color: var(--wb-claw-text-link-hover);\n  border-bottom-color: var(--wb-claw-text-link-hover);\n}\n.workbuddy-topbar-claw-connected-label {\n  color: var(--wb-color-text-tertiary);\n  font-size: 14px;\n}\n.workbuddy-topbar-claw-channel-tags {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  flex-shrink: 1;\n  min-width: 0px;\n  overflow: hidden;\n}\n.workbuddy-topbar-claw-channel-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  flex: 0 0 auto;\n  padding: 2px 4px;\n  border-radius: 12px;\n  font-size: 13px;\n  font-weight: 500;\n  letter-spacing: .2px;\n}\n.workbuddy-topbar-claw-channel-tag .workbuddy-topbar-claw-channel-name {\n  white-space: nowrap;\n}\n.workbuddy-topbar-claw-channel-tag .workbuddy-topbar-claw-channel-logo {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  border-radius: 3px;\n  object-fit: contain;\n}\n.workbuddy-topbar-claw-channel-overflow {\n  flex: 0 0 auto;\n  font-size: var(--wb-font-body-size);\n  line-height: var(--wb-font-body-line-height);\n  color: var(--wb-color-text-tertiary);\n}\n.workbuddy-topbar-claw-channel-tags-probe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  gap: inherit;\n  width: max-content;\n  visibility: hidden;\n  pointer-events: none;\n}\n.workbuddy-topbar-claw-channel-overflow-probe {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: max-content;\n  visibility: hidden;\n  pointer-events: none;\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-wecom {\n  color: var(--wb-claw-text-wecom);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-feishu {\n  color: var(--wb-claw-text-feishu);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-qq {\n  color: var(--wb-claw-text-qq);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-dingtalk {\n  color: var(--wb-claw-text-dingtalk);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-wechat {\n  color: var(--wb-claw-text-wechat);\n}\n.workbuddy-topbar-claw-channel-tag.workbuddy-topbar-claw-yuanbao {\n  color: var(--wb-claw-text-yuanbao);\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  border-radius: 4px;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon svg {\n  width: 14px;\n  height: 14px;\n}\n.workbuddy-topbar-claw-connected-info .workbuddy-topbar-claw-settings-icon:hover {\n  color: var(--wb-color-text-primary);\n  background-color: var(--wb-bg-hover);\n}\n.workbuddy-topbar-claw-disconnected {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n}\n.um-header__inner {\n  display: inline-flex;\n  align-items: center;\n  flex-shrink: 0;\n}\n.um-tab--active svg {\n  color: var(--wb-text-white);\n}\n.um-tab--active svg path {\n  fill: var(--wb-text-white);\n}\n[data-theme=dark] .um-tab--active,\n.vscode-dark .um-tab--active,\n.dark .um-tab--active {\n  background: var(--wb-button-grey-bg);\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg,\n.vscode-dark .um-tab--active svg,\n.dark .um-tab--active svg {\n  color: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active svg path,\n.vscode-dark .um-tab--active svg path,\n.dark .um-tab--active svg path {\n  fill: var(--wb-button-grey-fg);\n}\n[data-theme=dark] .um-tab--active:hover,\n.vscode-dark .um-tab--active:hover,\n.dark .um-tab--active:hover {\n  color: var(--wb-button-grey-fg);\n}\n.expert-center-page {\n  --ec-page-gutter: 24px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary);\n  color: var(--wb-color-text-primary);\n}\n.expert-center-page.is-inactive {\n  opacity: .96;\n}\n.ec-list-tabs-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.ec-list-tabs {\n  display: inline-flex;\n  align-items: center;\n  gap: 20px;\n  flex-shrink: 0;\n}\n.ec-list-tab {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 0;\n  border: none;\n  background: transparent;\n  color: var(--wb-text-weak);\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 28px;\n  white-space: nowrap;\n  cursor: pointer;\n  transition: opacity .15s ease;\n}\n.ec-list-tab:hover,\n.ec-list-tab.is-active {\n  color: var(--wb-color-text-primary);\n}\n.expert-center-page {\n  --ec-page-gutter: 20px ;\n}\n.ec-page-layout {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  margin-bottom: 20px;\n  padding: 0 var(--ec-page-gutter);\n  flex-shrink: 0;\n  -webkit-app-region: drag;\n}\n.ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n.ec-main-content {\n  position: relative;\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  overflow-x: hidden;\n}\n.expert-center-page {\n  --ec-page-gutter: 20px;\n  --ec-content-gutter: 20px ;\n}\n.discover-panel-page:has(.wb-modal__overlay.dc-detail-overlay.is-open) > .workbuddy-topbar {\n  z-index: 0;\n}\n.main-content--chat,\n.main-content--chat .workbuddy-topbar,\n.main-content--initializing {\n  background: var(--wb-home-bg-secondary);\n}\n.project-detail-view > .workbuddy-topbar {\n  border-bottom: 1px solid var(--wb-border-card, var(--wb-border-default));\n}\n.skills-view .workbuddy-topbar.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 24px;\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary);\n  -webkit-app-region: drag;\n}\n.skills-view .ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-left: auto;\n  min-width: 0;\n  flex-shrink: 1;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar__right > .wb-button {\n  flex: 0 0 auto;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 10px;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: background .15s ease, color .15s ease;\n  -webkit-app-region: no-drag;\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.skills-view .ec-topbar--subpage .ec-topbar__back svg {\n  flex-shrink: 0;\n}\n\n/* src/app.css */\n:root {\n  --wb-spacing-12:64px;\n}\n.wbh-anchor {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.wbh-plus {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  transition: background-color 100ms ease;\n}\n.wbh-plus:hover:not(:disabled),\n.wbh-plus[aria-expanded=true] {\n  background: var(--dsw-alias-interactive-bg-hover-solid);\n}\n.wbh-popScrim {\n  position: fixed;\n  inset: 0;\n  z-index: 6240;\n}\n.wbh-pop {\n  position: absolute;\n  left: 0;\n  bottom: calc(100% + 10px);\n  z-index: 6250;\n  display: flex;\n  flex-direction: column;\n  width: min(680px, calc(100vw - 60px));\n  max-height: min(560px, calc(100vh - 160px));\n  border: 1px solid var(--wb-border-default);\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, .16);\n  overflow: hidden;\n  animation: wbhPopIn .15s ease;\n}\n@keyframes wbhPopIn {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.wbh-pop .ec-picker-panel {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  flex: 1;\n  background: var(--wb-bg-primary);\n}\n.wbh-pop .ec-expert-grid {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 0 20px 16px;\n  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\n}\n.wbh-pop .ec-category-tabs-wrap {\n  margin: 0;\n  padding: 12px 20px 8px;\n}\n.wbh-popNotice {\n  padding: 8px 20px 12px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n  border-top: 1px solid var(--wb-border-default);\n}\n.wbh-page {\n  box-sizing: border-box;\n  max-width: 1180px;\n  margin: 0 auto;\n  padding: 16px 24px 40px;\n}\n.wbh-market-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  height: 54px;\n  padding: 0 4px;\n  border-bottom: 1px solid var(--wb-border-default);\n}\n.wbh-market-panel .ec-expert-grid {\n  padding: 16px 4px;\n}\n.ec-market-panel {\n  display: flex;\n  flex-direction: column;\n}\n.wbh-state {\n  grid-column: 1/-1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  padding: 70px 0;\n  color: var(--wb-color-text-tertiary);\n  font-size: 13px;\n}\n.wbh-state p {\n  margin: 0;\n}\n.wbh-avatar-letter {\n  display: grid;\n  place-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--wb-button-primary-fg);\n  background: var(--wb-avatar-bg-accent);\n}\n.wbh-authBar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 10px 4px 14px;\n}\n.wbh-authState {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-dot {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--wb-palette-green-1,#2b8a3e);\n}\n.wbh-dot.off {\n  background: var(--wb-color-text-tertiary);\n}\n.wbh-notice {\n  margin: 10px 4px 0;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-muted {\n  font-size: 11px;\n  color: var(--wb-color-text-tertiary);\n}\n.wbh-btnPrimary,\n.wbh-btnGhost {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 30px;\n  padding: 0 14px;\n  border-radius: 8px;\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background .15s ease;\n}\n.wbh-btnPrimary {\n  border: none;\n  background: var(--wb-button-primary-bg);\n  color: var(--wb-button-primary-fg);\n}\n.wbh-btnPrimary:hover {\n  background: var(--wb-button-primary-bg-hover);\n}\n.wbh-btnGhost {\n  border: 1px solid var(--wb-border-default);\n  background: transparent;\n  color: var(--wb-color-text-primary);\n}\n.wbh-btnGhost:hover {\n  background: var(--wb-bg-hover);\n}\n.wbh-rail {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  padding: 2px;\n  flex-wrap: wrap;\n}\n.wbh-railChip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 26px;\n  padding: 0 6px 0 4px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 999px;\n  background: var(--wb-bg-secondary);\n  font-size: 12px;\n  color: var(--wb-color-text-primary);\n}\n.wbh-railIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  overflow: hidden;\n  background: var(--wb-bg-hover);\n}\n.wbh-railIcon img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.wbh-railName {\n  max-width: 140px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.wbh-railX {\n  display: grid;\n  place-items: center;\n  width: 16px;\n  height: 16px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  cursor: pointer;\n  opacity: 0;\n  transition: opacity .12s ease;\n}\n.wbh-railChip:hover .wbh-railX,\n.wbh-railX:focus-visible {\n  opacity: 1;\n}\n.wbh-railX:hover {\n  background: var(--wb-bg-hover);\n  color: var(--wb-color-text-primary);\n}\n.wbh-settings {\n  padding: 4px 2px;\n}\n.wbh-secTitle {\n  margin: 0 0 10px;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--wb-color-text-primary);\n}\n.wbh-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 8px 0;\n  border-bottom: 1px solid var(--wb-border-default);\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-modalInput {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 8px 10px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 8px;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-color-text-primary);\n  font: inherit;\n  font-size: 12px;\n  resize: vertical;\n  outline: none;\n}\n.wbh-modalInput:focus {\n  border-color: var(--wb-border-hover);\n}\n.wbh-authCard {\n  position: relative;\n  width: min(560px, calc(100vw - 48px));\n  max-height: calc(100vh - 80px);\n  overflow: auto;\n  padding: 24px;\n  border-radius: 16px;\n  background: var(--wb-bg-primary);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, .18);\n  animation: wbhPopIn .15s ease;\n}\n.wbh-authHead {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n.wbh-authTitle {\n  margin: 0;\n  font-size: 17px;\n  font-weight: 650;\n  color: var(--wb-color-text-primary);\n}\n.wbh-authClose {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border: none;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--wb-color-text-secondary);\n  cursor: pointer;\n}\n.wbh-authClose:hover {\n  background: var(--wb-bg-hover);\n}\n.wbh-authDesc {\n  margin: 8px 0 14px;\n  font-size: 12.5px;\n  line-height: 1.7;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-authQr {\n  display: grid;\n  place-items: center;\n  padding: 12px;\n  margin: 0 auto 12px;\n  width: min(344px, 100%);\n  border-radius: 12px;\n  background: #fff;\n}\n.wbh-authQr img {\n  display: block;\n  width: 320px;\n  height: 320px;\n}\n.wbh-authLink {\n  display: block;\n  width: 100%;\n  text-align: left;\n  padding: 8px 12px;\n  border: none;\n  border-radius: 8px;\n  background: var(--wb-bg-secondary);\n  color: var(--wb-palette-blue-1,#2f6bff);\n  font-size: 12px;\n  cursor: pointer;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.wbh-authCopy {\n  display: block;\n  margin: 10px auto 0;\n  padding: 6px 16px;\n  border: 1px solid var(--wb-border-default);\n  border-radius: 10px;\n  background: transparent;\n  color: var(--wb-color-text-primary);\n  font-size: 13px;\n  cursor: pointer;\n}\n.wbh-authWaiting {\n  margin: 14px 0 0;\n  text-align: center;\n  font-size: 12px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-authCancel {\n  display: block;\n  width: 100%;\n  margin-top: 16px;\n  padding: 10px;\n  border-radius: 12px;\n}\n.wbh-authDone {\n  padding: 20px 0 6px;\n  text-align: center;\n}\n.wbh-authDone p {\n  margin: 0 0 14px;\n  font-size: 13px;\n  color: var(--wb-color-text-primary);\n}\n.wbh-authError {\n  color: #c0392b;\n}\n.wbh-modalRoot {\n  position: fixed;\n  inset: 0;\n  z-index: 6300;\n  display: grid;\n  place-items: center;\n}\n.wbh-modalScrim {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, .28);\n  animation: wbhFade .15s ease;\n}\n@keyframes wbhFade {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes ec-overlay-in {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes ec-modal-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes ec-picker-scale-in {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.ec-market-panel {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  height: 100%;\n}\n.expert-center-page {\n  --ec-page-gutter:24px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n  background: var(--wb-home-bg-secondary,#f7f7f7);\n  color: var(--wb-color-text-primary);\n}\n.ec-topbar {\n  display: flex;\n  align-items: center;\n  height: 52px;\n  padding: 0 var(--ec-page-gutter);\n  flex-shrink: 0;\n  background: var(--wb-home-bg-secondary,#f7f7f7);\n}\n.ec-topbar__left {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.ec-page-layout {\n  display: flex;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.ec-main-content {\n  position: relative;\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.ec-main-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.ec-list-tabs-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 12px;\n  padding: 4px var(--ec-page-gutter);\n}\n.ec-list-tabs {\n  display: inline-flex;\n  align-items: center;\n  gap: 20px;\n  flex-shrink: 0;\n}\n.ec-list-tab {\n  position: relative;\n  padding: 4px 0;\n  border: none;\n  background: transparent;\n  color: var(--wb-color-text-tertiary);\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: color .2s ease;\n}\n.ec-list-tab:hover {\n  color: var(--wb-color-text-secondary);\n}\n.ec-list-tab.is-active {\n  color: var(--wb-color-text-primary);\n  font-weight: 600;\n}\n.ec-list-tab.is-active::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: -3px;\n  height: 2px;\n  border-radius: 2px;\n  background: var(--wb-color-text-primary);\n}\n.ec-category-tabs-wrap {\n  padding: 0 var(--ec-page-gutter);\n  margin-bottom: 8px;\n}\n.ec-category-tab {\n  font-size: 12.5px;\n  padding: 4px 12px;\n}\n.ec-picker-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--wb-border-default) transparent;\n}\n.wbh-menu {\n  position: absolute;\n  left: 0;\n  bottom: calc(100% + 10px);\n  z-index: 6250;\n  width: 200px;\n  padding: 8px;\n  border: 1px solid rgba(0, 0, 0, .08);\n  border-radius: 16px;\n  background: var(--wb-bg-primary,#fff);\n  box-shadow: 0 6px 24px rgba(0, 0, 0, .04), 0 4px 6px rgba(0, 0, 0, .04);\n  animation: wbhPopIn .15s ease;\n}\n.wbh-menu-list {\n  display: flex;\n  flex-direction: column;\n  max-height: 224px;\n  overflow-y: auto;\n}\n.wbh-menu-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 32px;\n  padding: 0 8px;\n  border-radius: 8px;\n  font-size: 14px;\n  color: var(--wb-color-text-primary);\n  cursor: pointer;\n  transition: background .12s ease;\n}\n.wbh-menu-item:hover {\n  background: var(--wb-bg-hover,#f5f5f5);\n}\n.wbh-menu-item.is-empty {\n  color: var(--wb-color-text-tertiary);\n  font-size: 13px;\n  cursor: default;\n}\n.wbh-menu-item.is-empty:hover {\n  background: transparent;\n}\n.wbh-menu-avatar {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  background: var(--wb-bg-hover,#eee);\n  font-size: 9px;\n  font-weight: 600;\n  color: #fff;\n}\n.wbh-menu-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.wbh-menu-name {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 14px;\n  line-height: 22px;\n}\n.wbh-menu-divider {\n  height: 1px;\n  background: rgba(0, 0, 0, .06);\n  margin: 4px 0;\n}\n.wbh-menu-summonMore {\n  color: var(--wb-color-text-primary);\n}\n.wbh-menu-summonMoreIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-menu-summonMoreLabel {\n  font-size: 14px;\n}\n.ec-modal-overlay {\n  z-index: 6300;\n  padding: 20px;\n}\n.ec-modal-card {\n  width: 640px;\n  max-width: calc(100vw - 40px);\n  max-height: 640px;\n}\n.ec-modal-card .ec-modal-quick-prompt-btn {\n  font-size: 14px;\n  line-height: 22px;\n  background: #f7f7f7;\n  min-height: 48px;\n  height: 48px;\n  gap: 16px;\n  padding: 12px 16px;\n  border: none;\n  box-sizing: border-box;\n}\n.ec-modal-card .ec-modal-quick-prompt-btn .ec-modal-quick-prompt-text {\n  font-size: 14px;\n  line-height: 22px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ec-modal-card.is-expert-view .ec-modal-header-summon-btn {\n  min-width: 124px;\n  height: 32px;\n}\n.ec-modal-card.is-expert-view .ec-modal-close {\n  padding: 0;\n}\n.wbh-picker-footer {\n  border-top: 1px solid var(--wb-border-default,#e5e5e5);\n  padding: 6px 8px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.wbh-picker-footerItem {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 34px;\n  padding: 0 8px;\n  border-radius: 8px;\n  font-size: 14px;\n  color: var(--wb-color-text-primary);\n  cursor: pointer;\n}\n.wbh-picker-footerItem:hover {\n  background: var(--wb-bg-hover,#f5f5f5);\n}\n.wbh-picker-footerIcon {\n  display: inline-flex;\n  width: 16px;\n  justify-content: center;\n  color: var(--wb-color-text-secondary);\n}\n.wbh-picker-localTitle {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--wb-color-text-tertiary);\n  padding: 8px 4px 4px;\n}\n";
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
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
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
var import_react10 = __toESM(require("react"), 1);

// src/icons.js
var import_react = __toESM(require("react"), 1);
var h = import_react.default.createElement;
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

// src/MarketPage.jsx
var import_react6 = __toESM(require("react"), 1);

// src/hub.js
var API = "/workbuddy-hub";
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
async function api(path, options) {
  const response = await fetch(API + path, options);
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
    official: true
  };
}
var hub = {
  api,
  post,
  toEntry,
  /** Catalogue for one kind, official sources first. */
  async list(kind, { query = "", category = "", limit = 60 } = {}) {
    const q = encodeURIComponent(query);
    const c = encodeURIComponent(category || "");
    if (kind === "connector") {
      const r2 = await api(`/market-list?kind=connector&pageSize=${limit}&q=${q}`);
      return (r2.rows ?? []).map((x) => ({ ...toEntry(x, "connector"), isConnected: x.isConnected, mcp: x.mcp, authType: x.authType }));
    }
    try {
      if (kind === "expert") {
        const r3 = await api(`/official-experts?limit=${limit}&q=${q}&category=${c}`);
        const rows = (r3.rows ?? []).map((x) => toEntry(x, kind));
        if (rows.length) return rows;
        if (r3.total === 0 && query === "" && !category) return [];
      }
      const r2 = await api(`/market-list?kind=${kind}&pageSize=${limit}&q=${q}&category=${c}`);
      if (r2.source === "official") return (r2.rows ?? []).map((x) => toEntry(x, kind));
    } catch {
    }
    await api("/catalog");
    const r = await api(`/search?q=${q}&kind=${kind}s&limit=${limit}`);
    return (r.hits ?? []).map((x) => ({ ...toEntry(x, kind), official: false }));
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
  enableConnector: (name) => post("/connectors/enable", { name }).then((r) => {
    _emitChange();
    return r;
  }),
  disableConnector: (name) => post("/connectors/disable", { name }).then((r) => {
    _emitChange();
    return r;
  }),
  auth: () => api("/wb-auth"),
  authStart: () => post("/wb-auth/start", {}),
  authPoll: () => post("/wb-auth/poll", {}),
  authLogout: () => post("/wb-auth/logout", {})
};

// src/Catalogue.jsx
var import_react2 = __toESM(require("react"), 1);
var KINDS = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "person" },
  { id: "skill", label: "\u6280\u80FD", icon: "sparkle" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "link" }
];
function SkillCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`;
  return /* @__PURE__ */ import_react2.default.createElement(
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
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-content" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-icon" }, entry.icon ? /* @__PURE__ */ import_react2.default.createElement(
      "img",
      {
        src: entry.icon,
        alt: entry.displayName,
        width: 28,
        height: 28,
        style: { borderRadius: 6, objectFit: "cover", flexShrink: 0, background: "rgba(128,128,128,.15)" }
      }
    ) : /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-avatar-letter", style: { width: 28, height: 28, borderRadius: 6, fontSize: 13 } }, (entry.displayName || "?").slice(0, 1))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-top" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-body" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-name-row" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "skill-card-name" }, entry.displayName)))), /* @__PURE__ */ import_react2.default.createElement(
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
      /* @__PURE__ */ import_react2.default.createElement(WbIcon, { name: "plus", size: 14 })
    )),
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "skill-card-desc skill-card-desc--two-lines" }, entry.description || entry.name)
  );
}
function ConnectorCard({ entry, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`;
  const enabled = entry._enabled;
  const dot = busy === key ? "connecting" : enabled ? "connected" : "";
  return /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      className: `connector-card${enabled ? " connector-card--installed" : ""}`,
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
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-icon" }, entry.icon ? /* @__PURE__ */ import_react2.default.createElement("img", { src: entry.icon, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" } }) : /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-avatar-letter", style: { width: 28, height: 28, borderRadius: "50%", fontSize: 13 } }, (entry.displayName || "?").slice(0, 1))),
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-main" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-name-row" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-name" }, entry.displayName), dot && /* @__PURE__ */ import_react2.default.createElement("span", { className: `connector-card-status-dot connector-card-status-dot--${dot}` })), /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-desc" }, entry.description || entry.name)),
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "connector-card-action" }, /* @__PURE__ */ import_react2.default.createElement(
      "button",
      {
        type: "button",
        className: "wbh-btnGhost",
        disabled: busy === key,
        "aria-label": `${enabled ? "\u65AD\u5F00" : "\u8FDE\u63A5"} ${entry.displayName}`,
        onClick: (e) => {
          e.stopPropagation();
          onAction?.(entry);
        }
      },
      busy === key ? "\u2026" : enabled ? "\u65AD\u5F00" : "\u8FDE\u63A5"
    ))
  );
}
function ExpertCard({ entry, kindLabel, busy, onDetail, onAction }) {
  const key = `${entry.kind}/${entry.name}`;
  const label = busy === key ? "\u2026" : entry.kind === "expert" ? "\u53EC\u5524" : "\u8FDE\u63A5";
  return /* @__PURE__ */ import_react2.default.createElement(
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
    /* @__PURE__ */ import_react2.default.createElement(
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
    /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-main" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-head" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-avatar-sq" }, entry.icon ? /* @__PURE__ */ import_react2.default.createElement("img", { src: entry.icon, alt: "", loading: "lazy" }) : /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-avatar-letter" }, (entry.displayName || "?").slice(0, 1))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-body" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-title-row" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-role-wrap" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-role" }, entry.displayName))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-subtitle" }, entry.subtitle || kindLabel))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-desc" }, entry.description || entry.name), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-card-tags" }, (entry.tags ?? []).slice(0, 3).map((t) => /* @__PURE__ */ import_react2.default.createElement("span", { key: t, className: "ec-card-tag" }, t))))
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
  variant = "page"
}) {
  const [rows, setRows] = (0, import_react2.useState)([]);
  const [categories, setCategories] = (0, import_react2.useState)([]);
  const [category, setCategory] = (0, import_react2.useState)("");
  const [loading, setLoading] = (0, import_react2.useState)(true);
  const [failed, setFailed] = (0, import_react2.useState)("");
  const [segment, setSegment] = (0, import_react2.useState)(0);
  const [featured, setFeatured] = (0, import_react2.useState)([]);
  const [localRows, setLocalRows] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    setCategory("");
    setSegment(0);
  }, [kind]);
  (0, import_react2.useEffect)(() => {
    let live = true;
    hub.categories(kind).then((c) => {
      if (live) setCategories(c);
    }).catch(() => {
    });
    if (kind === "skill") hub.localSkills().then((r) => {
      if (live) setLocalRows(r);
    }).catch(() => {
    });
    return () => {
      live = false;
    };
  }, [kind]);
  (0, import_react2.useEffect)(() => {
    let live = true;
    setLoading(true);
    setFailed("");
    hub.list(kind, { query, category, limit: 60 }).then((r) => {
      if (!live) return;
      const merged = kind === "connector" ? r.map((x) => ({ ...x, _enabled: Boolean(installed[`${x.kind}/${x.name}`]?.enabled) })) : r;
      setRows(merged);
      setLoading(false);
      if (kind === "skill") setFeatured(shuffle(r).slice(0, 5));
    }).catch((e) => {
      if (live) {
        setFailed(e.message);
        setRows([]);
        setLoading(false);
      }
    });
    return () => {
      live = false;
    };
  }, [kind, query, category, installed]);
  const kindMeta = KINDS.find((k) => k.id === kind) || KINDS[0];
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const kindTabs = /* @__PURE__ */ import_react2.default.createElement("div", { className: "um-header__tabs" }, KINDS.map((k) => /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      key: k.id,
      type: "button",
      className: `um-tab${kind === k.id ? " um-tab--active" : ""}`,
      onClick: () => onKind(k.id)
    },
    /* @__PURE__ */ import_react2.default.createElement(WbIcon, { name: k.icon, size: 14 }),
    /* @__PURE__ */ import_react2.default.createElement("span", null, k.label)
  )));
  const searchBox = /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-search-wrapper" }, /* @__PURE__ */ import_react2.default.createElement(WbIcon, { name: "search", size: 14 }), /* @__PURE__ */ import_react2.default.createElement(
    "input",
    {
      value: query,
      placeholder: `\u641C\u7D22${kindMeta.label}`,
      "aria-label": `\u641C\u7D22${kindMeta.label}`,
      onChange: (e) => onQuery(e.target.value)
    }
  ));
  const skillGrid = /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-grid" }, loading && skeletonCards, !loading && failed && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, "\u8BFB\u53D6\u5931\u8D25\uFF1A", failed), !loading && !failed && rows.length === 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react2.default.createElement("p", null, "\u6682\u65E0\u6280\u80FD")), rows.map((entry) => /* @__PURE__ */ import_react2.default.createElement(
    SkillCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      busy,
      onDetail,
      onAction
    }
  )));
  const skillCategoryRow = /* @__PURE__ */ import_react2.default.createElement("div", { className: "category-chip-list" }, /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      type: "button",
      className: `category-chip${category === "" ? " category-chip--active" : ""}`,
      onClick: () => setCategory("")
    },
    /* @__PURE__ */ import_react2.default.createElement("span", { className: "category-chip-label" }, "\u5168\u90E8")
  ), categories.map((c) => /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      key: c.id,
      type: "button",
      className: `category-chip${category === c.id ? " category-chip--active" : ""}`,
      onClick: () => setCategory(c.id)
    },
    /* @__PURE__ */ import_react2.default.createElement("span", { className: "category-chip-label" }, c.label)
  )));
  const skillSegment = /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-segment-bar" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-segment-group" }, ["\u63A8\u8350", "\u5957\u4EF6"].map((s, i) => /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      key: s,
      type: "button",
      className: `skills-segment-item${segment === i ? " skills-segment-item--active" : ""}`,
      onClick: () => setSegment(i)
    },
    s
  ))));
  const skillPage = /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-view" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-content" }, !query && segment === 0 && featured.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-featured-section" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-featured-header" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-featured-title" }, "\u7CBE\u9009\u6280\u80FD"), /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      type: "button",
      className: "skills-featured-refresh-btn",
      onClick: () => setFeatured(shuffle(rows).slice(0, 5))
    },
    /* @__PURE__ */ import_react2.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: "14", height: "14" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: "M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" })),
    /* @__PURE__ */ import_react2.default.createElement("span", null, "\u6362\u4E00\u6362")
  )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-grid" }, featured.map((entry) => /* @__PURE__ */ import_react2.default.createElement(
    SkillCard,
    {
      key: `f-${entry.kind}/${entry.name}`,
      entry,
      busy,
      onDetail,
      onAction
    }
  )))), skillSegment, skillCategoryRow, skillGrid));
  const categoryRow = /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-category-tabs-wrap" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-category-tabs" }, /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      type: "button",
      className: `ec-category-tab${category === "" ? " is-active" : ""}`,
      onClick: () => setCategory("")
    },
    "\u5168\u90E8"
  ), categories.map((c) => /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      key: c.id,
      type: "button",
      className: `ec-category-tab${category === c.id ? " is-active" : ""}`,
      onClick: () => setCategory(c.id)
    },
    c.label,
    typeof c.count === "number" && /* @__PURE__ */ import_react2.default.createElement("span", { className: "ec-expert-count" }, c.count)
  ))));
  const cardGrid = kind === "connector" ? /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-grid" }, rows.map((entry) => /* @__PURE__ */ import_react2.default.createElement(
    ConnectorCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      busy,
      onDetail,
      onAction
    }
  ))) : /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-expert-grid" }, loading && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, "\u6B63\u5728\u8BFB\u53D6\u5E02\u573A\u76EE\u5F55\u2026"), !loading && failed && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, "\u8BFB\u53D6\u5931\u8D25\uFF1A", failed), !loading && !failed && rows.length === 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react2.default.createElement(WbIcon, { name: kindMeta.icon, size: 40 }), /* @__PURE__ */ import_react2.default.createElement("p", null, "\u6682\u65E0\u8BE5\u5206\u7C7B\u7684\u6761\u76EE")), rows.map((entry) => /* @__PURE__ */ import_react2.default.createElement(
    ExpertCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      kindLabel: kindMeta.label,
      busy,
      onDetail,
      onAction
    }
  )));
  const mainPage = /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-market-panel" }, /* @__PURE__ */ import_react2.default.createElement("header", { className: "ec-topbar" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-topbar__left" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "um-header__inner" }, kindTabs)), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-topbar__right" }, searchBox, kind === "skill" && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "wbh-btnGhost" }, "\u6211\u5B89\u88C5\u7684"), /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "wbh-btnGhost" }, "\u6DFB\u52A0\u6280\u80FD")))), /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-page-layout" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-main-content" }, kind === "skill" ? skillPage : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, categoryRow, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-main-scroll" }, cardGrid)))));
  const pickerGrid = /* @__PURE__ */ import_react2.default.createElement("div", { className: kind === "expert" ? "ec-expert-grid" : "skills-grid" }, loading && skeletonCards, !loading && failed && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-state" }, "\u8BFB\u53D6\u5931\u8D25\uFF1A", failed), rows.map((entry) => kind === "expert" ? /* @__PURE__ */ import_react2.default.createElement(
    ExpertCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      kindLabel: kindMeta.label,
      busy,
      onDetail,
      onAction
    }
  ) : kind === "connector" ? /* @__PURE__ */ import_react2.default.createElement(
    ConnectorCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      busy,
      onDetail,
      onAction
    }
  ) : /* @__PURE__ */ import_react2.default.createElement(
    SkillCard,
    {
      key: `${entry.kind}/${entry.name}`,
      entry,
      busy,
      onDetail,
      onAction
    }
  )));
  if (variant === "picker") {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-picker-panel" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-picker-header" }, kindTabs, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-picker-header-right" }, searchBox)), kind === "skill" ? skillCategoryRow : categoryRow, /* @__PURE__ */ import_react2.default.createElement("div", { className: "ec-picker-scroll" }, kind === "skill" && localRows.length > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-picker-local" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-picker-localTitle" }, "\u5DF2\u5B89\u88C5\uFF08\u672C\u673A\uFF09"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "skills-grid" }, localRows.map((entry) => /* @__PURE__ */ import_react2.default.createElement(
      SkillCard,
      {
        key: `local-${entry.name}`,
        entry,
        busy,
        onDetail,
        onAction
      }
    )))), pickerGrid), /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-picker-footer" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-picker-footerItem", role: "menuitem", tabIndex: 0 }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-picker-footerIcon" }, "\u2191"), /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-picker-footerLabel" }, "\u4ECE\u672C\u5730\u6DFB\u52A0\u6280\u80FD")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "wbh-picker-footerItem", role: "menuitem", tabIndex: 0 }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-picker-footerIcon" }, "\u25CE"), /* @__PURE__ */ import_react2.default.createElement("span", { className: "wbh-picker-footerLabel" }, "\u7BA1\u7406\u6280\u80FD"))));
  }
  return mainPage;
}

// src/SummonModal.jsx
var import_react3 = __toESM(require("react"), 1);
function SummonModal({ entry, busy, onClose, onConfirm, onQuickPrompt }) {
  const [task, setTask] = (0, import_react3.useState)("");
  const prompts = (entry.quickPrompts ?? []).slice(0, 3);
  const profession = entry.subtitle || "\u4E13\u5BB6";
  const useCount = entry.useCount ? `${entry.useCount}\u6B21\u4F7F\u7528` : "";
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-overlay", role: "dialog", "aria-modal": "true", "aria-label": `\u53EC\u5524 ${entry.displayName}` }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-card is-expert-view" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-top" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-avatar" }, entry.icon ? /* @__PURE__ */ import_react3.default.createElement("img", { src: entry.icon, alt: "" }) : /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-avatar-fallback" }, (entry.displayName || "?").slice(0, 1))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-info" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-title-row" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-role" }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-role-primary" }, profession), /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-role-separator", "aria-hidden": "true" }), /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-role-secondary" }, entry.displayName)), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-actions" }, useCount && /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-use-count" }, useCount), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "ec-modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ import_react3.default.createElement(WbIcon, { name: "close", size: 14 })))), /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      type: "button",
      className: "ec-modal-summon-btn ec-modal-header-summon-btn",
      disabled: busy,
      onClick: () => onConfirm(task)
    },
    busy ? "\u53EC\u5524\u4E2D\u2026" : "\u53EC\u5524\u4E13\u5BB6"
  ))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-scroll-shell" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-body" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-content" }, /* @__PURE__ */ import_react3.default.createElement("p", { className: "ec-modal-desc" }, entry.description || "\u4E13\u5BB6\u8FD0\u884C\u5728\u72EC\u7ACB\u4F1A\u8BDD\u4E2D\uFF0C\u4E3B\u5BF9\u8BDD\u53EA\u63A5\u6536\u7ED3\u8BBA\u3002"), entry.tags?.length > 0 && /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-tags-list" }, entry.tags.map((t) => /* @__PURE__ */ import_react3.default.createElement("span", { key: t, className: "ec-modal-tag-chip" }, t)))), prompts.length > 0 && /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-quick-prompts" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-section-title" }, "\u4E13\u5BB6\u5E2E\u4F60\u505A"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "ec-modal-quick-prompts-list" }, prompts.map((p, i) => /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      key: i,
      type: "button",
      className: "ec-modal-quick-prompt-btn",
      onClick: () => onQuickPrompt?.(p)
    },
    /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-quick-prompt-text" }, p),
    /* @__PURE__ */ import_react3.default.createElement("span", { className: "ec-modal-quick-prompt-action" }, /* @__PURE__ */ import_react3.default.createElement(WbIcon, { name: "chevronRight", size: 14 }))
  ))))))));
}

// src/ConnectorAuthModal.jsx
var import_react4 = __toESM(require("react"), 1);
function ConnectorAuthModal({ entry, refs = [], error, authDomain = "", retryable = true, busy, onClose, onRetry }) {
  const domain = authDomain || entry?.cli?.authDomain || "";
  const authUrl = domain ? `https://${domain.replace(/^https?:\/\//, "")}` : "";
  return /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-overlay", role: "dialog", "aria-modal": "true", "aria-label": `\u8FDE\u63A5 ${entry.displayName || entry.name}` }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-card", style: { opacity: 1 } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-top" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-avatar" }, entry.icon ? /* @__PURE__ */ import_react4.default.createElement("img", { src: entry.icon, alt: "" }) : /* @__PURE__ */ import_react4.default.createElement("span", { className: "ec-modal-avatar-fallback" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "link", size: 22 }))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-info" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-title-row" }, /* @__PURE__ */ import_react4.default.createElement("h3", { className: "ec-modal-role" }, "\u8FDE\u63A5 ", entry.displayName || entry.name), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-actions" }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "ec-modal-close", onClick: onClose, "aria-label": "\u5173\u95ED" }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "close", size: 14 })))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-meta" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "ec-modal-name" }, "\u6388\u6743\u5B8C\u6210\u540E\u56DE\u5230\u672C\u5BF9\u8BDD\u6846\u91CD\u8BD5")))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-scroll-shell" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-body" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-content" }, /* @__PURE__ */ import_react4.default.createElement("p", { className: "ec-modal-desc" }, error || entry.description || ""), refs.length > 0 ? /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-section-title", style: { marginTop: 14 } }, "\u8BE5\u8FDE\u63A5\u5668\u9700\u8981\u4EE5\u4E0B\u51ED\u8BC1"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-tags-list" }, refs.map((r) => /* @__PURE__ */ import_react4.default.createElement("span", { key: r, className: "ec-modal-tag-chip", style: { fontFamily: "ui-monospace, monospace" } }, r)))) : !retryable ? /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-tags-list", style: { marginTop: 14 } }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "ec-modal-tag-chip" }, "CLI \xB7 \u6280\u80FD\u5DF2\u6302\u8F7D")) : null, /* @__PURE__ */ import_react4.default.createElement("p", { className: "ec-modal-desc", style: { marginTop: 14 } }, authUrl ? `\u8BE5\u8FDE\u63A5\u5668\u7684\u6388\u6743\u5165\u53E3\u5728 ${domain}\uFF1B\u70B9\u51FB\u300C\u6253\u5F00\u6388\u6743\u9875\u300D\u4F1A\u65B0\u5F00\u6807\u7B7E\u9875\uFF0C\u6388\u6743\u540E\u56DE\u6765\u91CD\u8BD5\u3002` : "\u51ED\u8BC1\u7531 DSH \u51ED\u8BC1\u7BA1\u7406\u6301\u6709\uFF1B\u914D\u7F6E\u540E\u70B9\u300C\u91CD\u8BD5\u8FDE\u63A5\u300D\u5373\u53EF\u3002")))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "ec-modal-footer", style: { gap: 10 } }, /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: onClose }, "\u5173\u95ED"), authUrl && /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: () => window.open(authUrl, "_blank", "noopener") }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "external", size: 13 }), " \u6253\u5F00\u6388\u6743\u9875"), retryable && /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", className: "ec-modal-summon-btn", style: { width: "auto" }, disabled: busy, onClick: onRetry }, /* @__PURE__ */ import_react4.default.createElement(WbIcon, { name: "refresh", size: 13 }), " ", busy ? "\u8FDE\u63A5\u4E2D\u2026" : "\u91CD\u8BD5\u8FDE\u63A5"))));
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

// src/WbAuthCard.jsx
var import_react5 = __toESM(require("react"), 1);
var import_qrcode = __toESM(require_browser(), 1);
function WbAuthCard({ onClose, onDone }) {
  const [phase, setPhase] = (0, import_react5.useState)("starting");
  const [authUrl, setAuthUrl] = (0, import_react5.useState)("");
  const [qr, setQr] = (0, import_react5.useState)("");
  const [error, setError] = (0, import_react5.useState)("");
  const [nickname, setNickname] = (0, import_react5.useState)("");
  const timer = (0, import_react5.useRef)(null);
  const stopped = (0, import_react5.useRef)(false);
  (0, import_react5.useEffect)(() => {
    let cancelled = false;
    (async () => {
      try {
        const start = await hub.post("/wb-auth/start", {});
        if (cancelled) return;
        setAuthUrl(start.authUrl);
        setQr(await import_qrcode.default.toDataURL(start.authUrl, { width: 320, margin: 1 }));
        setPhase("waiting");
        const tick = async () => {
          if (cancelled) return;
          try {
            const r = await hub.post("/wb-auth/poll", {});
            if (cancelled) return;
            if (r.ok) {
              setNickname(r.nickname || "");
              setPhase("done");
              onDone?.();
              return;
            }
          } catch (e) {
            if (e.body && e.body.pending === false) {
              if (!cancelled) {
                setError(e.message);
                setPhase("error");
              }
              return;
            }
          }
          timer.current = setTimeout(tick, 2500);
        };
        timer.current = setTimeout(tick, 2e3);
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setPhase("error");
        }
      }
    })();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const copy = (0, import_react5.useCallback)(async () => {
    try {
      await navigator.clipboard.writeText(authUrl);
    } catch {
    }
  }, [authUrl]);
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-modalRoot", role: "dialog", "aria-modal": "true", "aria-label": "\u6DFB\u52A0\u817E\u8BAF\u8D26\u53F7" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-modalScrim", onClick: onClose }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authCard" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authHead" }, /* @__PURE__ */ import_react5.default.createElement("h3", { className: "wbh-authTitle" }, "\u6DFB\u52A0\u817E\u8BAF\u8D26\u53F7 \xB7 \u56FD\u5185\u7248"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-authClose", onClick: onClose, "aria-label": "\u5173\u95ED" }, "\u2715")), /* @__PURE__ */ import_react5.default.createElement("p", { className: "wbh-authDesc" }, "\u70B9\u5F00\u4E0B\u65B9\u94FE\u63A5\uFF08\u6216\u7528\u5FAE\u4FE1 / QQ \u626B\u7801\uFF09\u5728\u6D4F\u89C8\u5668\u91CC\u5B8C\u6210\u6388\u6743\uFF0C\u9875\u9762\u652F\u6301\u624B\u673A\u53F7\u767B\u5F55\uFF1B\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u7B7E\u5230\u5E76\u7EB3\u7BA1"), phase === "starting" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authWaiting" }, "\u6B63\u5728\u5411\u5B98\u65B9\u53D1\u8D77\u6388\u6743\u2026"), phase === "waiting" && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authQr" }, qr && /* @__PURE__ */ import_react5.default.createElement("img", { src: qr, alt: "\u6388\u6743\u4E8C\u7EF4\u7801", width: 320, height: 320 })), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-authLink", onClick: () => window.open(authUrl, "_blank", "noopener") }, "\u2197 ", authUrl.slice(0, 72), "\u2026"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-authCopy", onClick: copy }, "\u29C9 \u590D\u5236\u94FE\u63A5"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authWaiting" }, "\u25CC \u7B49\u5F85\u6388\u6743\u5B8C\u6210\uFF08\u6253\u5F00\u94FE\u63A5\u5728\u6D4F\u89C8\u5668\u91CC\u767B\u5F55\uFF0C\u6216\u626B\u7801\uFF1B\u624B\u673A\u53F7\u767B\u5F55\u4E5F\u53EF\u4EE5\uFF09\u2026"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-btnGhost wbh-authCancel", onClick: onClose }, "\u53D6\u6D88")), phase === "done" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authDone" }, /* @__PURE__ */ import_react5.default.createElement("p", null, "\u5DF2\u767B\u5F55", nickname ? `\uFF1A${nickname}` : "", "\u3002\u5B98\u65B9\u5E02\u573A\u6570\u636E\u5DF2\u53EF\u7528\u3002"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: onClose }, "\u5B8C\u6210")), phase === "error" && /* @__PURE__ */ import_react5.default.createElement("div", { className: "wbh-authDone" }, /* @__PURE__ */ import_react5.default.createElement("p", { className: "wbh-authError" }, "\u6388\u6743\u5931\u8D25\uFF1A", error), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: onClose }, "\u5173\u95ED"))));
}

// src/MarketPage.jsx
function MarketPage({ sessionId, runCommand: runCommand2 }) {
  const [kind, setKind] = (0, import_react6.useState)("expert");
  const [query, setQuery] = (0, import_react6.useState)("");
  const [installed, setInstalled] = (0, import_react6.useState)({});
  const [mounted, setMounted] = (0, import_react6.useState)(/* @__PURE__ */ new Set());
  const [busy, setBusy] = (0, import_react6.useState)("");
  const [notice, setNotice] = (0, import_react6.useState)("");
  const [summoning, setSummoning] = (0, import_react6.useState)(null);
  const [authorising, setAuthorising] = (0, import_react6.useState)(null);
  const [auth, setAuth] = (0, import_react6.useState)(null);
  const [showAuth, setShowAuth] = (0, import_react6.useState)(false);
  const refresh = (0, import_react6.useCallback)(async () => {
    try {
      const [inst, mnt, a] = await Promise.all([hub.installed(), hub.mounted(sessionId), hub.auth()]);
      setInstalled(inst);
      setMounted(new Set(mnt));
      setAuth(a);
    } catch {
    }
  }, [sessionId]);
  (0, import_react6.useEffect)(() => {
    void refresh();
  }, [refresh]);
  const attach = (0, import_react6.useCallback)(async (entry, task = "") => {
    const key = `${entry.kind}/${entry.name}`;
    setBusy(key);
    setNotice("");
    try {
      if (!installed[key]) await hub.install(entry.kind, entry.name, entry.official ? "official" : void 0);
      if (entry.kind === "connector") {
        if (installed[key]?.enabled) {
          await hub.disableConnector(entry.name);
          if (sessionId) await hub.unmount(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u65AD\u5F00\u300C${entry.displayName}\u300D`);
        } else {
          const r = await hub.enableConnector(entry.name);
          if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u8FDE\u63A5\u300C${entry.displayName}\u300D\uFF08\u5DE5\u5177\u547D\u540D\u7A7A\u95F4 ${r.serverName}\uFF09\uFF0C\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528\u3002`);
        }
      } else if (entry.kind === "expert") {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
        const line = `/expert ${entry.name}${task.trim() ? ` ${task.trim()}` : ""}`;
        const r = await runCommand2(sessionId, line);
        setNotice(r.ok ? `\u5DF2\u53EC\u5524\u300C${entry.displayName}\u300D\uFF1A${r.value?.text || "\u4E13\u5BB6\u4F1A\u8BDD\u5DF2\u521B\u5EFA"}` : `\u5DF2\u6302\u8F7D\uFF0C\u4F46\u53EC\u5524\u5931\u8D25\uFF1A${r.error}`);
      } else {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
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
  const onDetail = (0, import_react6.useCallback)((entry) => {
    if (entry.kind === "expert") setSummoning(entry);
    else void attach(entry);
  }, [attach]);
  const onAction = (0, import_react6.useCallback)((entry) => {
    void attach(entry);
  }, [attach]);
  const loggedIn = auth?.configured === true;
  return /* @__PURE__ */ import_react6.default.createElement("div", { className: "expert-center-page wbh-page" }, /* @__PURE__ */ import_react6.default.createElement("div", { className: "wbh-authBar" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "wbh-authState" }, /* @__PURE__ */ import_react6.default.createElement("i", { className: `wbh-dot${loggedIn ? "" : " off"}` }), loggedIn ? `\u5B98\u65B9\u8D26\u53F7\u5DF2\u767B\u5F55${auth?.nickname ? " \xB7 " + auth.nickname : ""}` : "\u5B98\u65B9\u8D26\u53F7\u672A\u767B\u5F55\uFF08\u6280\u80FD/\u7528\u91CF\u6570\u636E\u9700\u767B\u5F55\uFF09"), loggedIn ? /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: async () => {
    await hub.authLogout();
    await refresh();
  } }, "\u6CE8\u9500") : /* @__PURE__ */ import_react6.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: () => setShowAuth(true) }, "\u626B\u7801\u767B\u5F55")), /* @__PURE__ */ import_react6.default.createElement(
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
      busy
    }
  ), notice && /* @__PURE__ */ import_react6.default.createElement("p", { className: "wbh-notice" }, notice), summoning && /* @__PURE__ */ import_react6.default.createElement(
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
  ), authorising && /* @__PURE__ */ import_react6.default.createElement(
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
  ), showAuth && /* @__PURE__ */ import_react6.default.createElement(WbAuthCard, { onClose: () => {
    setShowAuth(false);
    void refresh();
  } }));
}

// src/ComposerAdd.jsx
var import_react7 = __toESM(require("react"), 1);
var KINDS2 = [
  { id: "expert", label: "\u4E13\u5BB6", icon: "person" },
  { id: "skill", label: "\u6280\u80FD", icon: "sparkle" },
  { id: "connector", label: "\u8FDE\u63A5\u5668", icon: "link" }
];
function ComposerAdd({ sessionId, runCommand: runCommand2 }) {
  const [menuOpen, setMenuOpen] = (0, import_react7.useState)(false);
  const [pickerOpen, setPickerOpen] = (0, import_react7.useState)(false);
  const [kind, setKind] = (0, import_react7.useState)("expert");
  const [query, setQuery] = (0, import_react7.useState)("");
  const [installed, setInstalled] = (0, import_react7.useState)({});
  const [mounted, setMounted] = (0, import_react7.useState)(/* @__PURE__ */ new Set());
  const [busy, setBusy] = (0, import_react7.useState)("");
  const [notice, setNotice] = (0, import_react7.useState)("");
  const [summoning, setSummoning] = (0, import_react7.useState)(null);
  const [authorising, setAuthorising] = (0, import_react7.useState)(null);
  const [recent, setRecent] = (0, import_react7.useState)([]);
  const anchor = (0, import_react7.useRef)(null);
  const refresh = (0, import_react7.useCallback)(async () => {
    try {
      const [inst, mnt] = await Promise.all([hub.installed(), hub.mounted(sessionId)]);
      setInstalled(inst);
      setMounted(new Set(mnt));
    } catch {
    }
  }, [sessionId]);
  (0, import_react7.useEffect)(() => {
    void refresh();
  }, [refresh]);
  (0, import_react7.useEffect)(() => onCatalogChange(refresh), [refresh]);
  (0, import_react7.useEffect)(() => {
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
  const openPicker = (0, import_react7.useCallback)((k) => {
    setKind(k);
    setQuery("");
    setMenuOpen(false);
    setPickerOpen(true);
  }, []);
  const attach = (0, import_react7.useCallback)(async (entry, task = "") => {
    const key = `${entry.kind}/${entry.name}`;
    setBusy(key);
    setNotice("");
    try {
      if (!installed[key]) {
        await hub.install(entry.kind, entry.name, entry.official ? "official" : void 0);
      }
      if (entry.kind === "connector") {
        if (installed[key]?.enabled) {
          await hub.disableConnector(entry.name);
          if (sessionId) await hub.unmount(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u65AD\u5F00\u300C${entry.displayName}\u300D`);
        } else {
          const r = await hub.enableConnector(entry.name);
          if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
          setNotice(`\u5DF2\u8FDE\u63A5\u300C${entry.displayName}\u300D\uFF08\u5DE5\u5177\u547D\u540D\u7A7A\u95F4 ${r.serverName}\uFF09\uFF0C\u4E0B\u4E00\u6B21\u6A21\u578B\u6B65\u9AA4\u8D77\u53EF\u7528\u3002`);
        }
      } else if (entry.kind === "expert") {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
        const line = `/expert ${entry.name}${task.trim() ? ` ${task.trim()}` : ""}`;
        const r = await runCommand2(sessionId, line);
        setNotice(r.ok ? `\u5DF2\u53EC\u5524\u300C${entry.displayName}\u300D\uFF1A${r.value?.text || "\u4E13\u5BB6\u4F1A\u8BDD\u5DF2\u521B\u5EFA"}` : `\u5DF2\u6302\u8F7D\uFF0C\u4F46\u53EC\u5524\u5931\u8D25\uFF1A${r.error}`);
      } else {
        if (sessionId) await hub.mount(sessionId, entry.kind, entry.name);
        setNotice(`\u5DF2\u6302\u8F7D\u300C${entry.displayName}\u300D`);
      }
      setRecent((prev) => [entry, ...prev.filter((e) => e.key !== key)].slice(0, 5));
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
    if (entry.kind === "expert") {
      setSummoning(entry);
      setPickerOpen(false);
    } else void attach(entry);
  }, [attach]);
  const onAction = (0, import_react7.useCallback)((entry) => {
    void attach(entry);
  }, [attach]);
  const menuEntries = (0, import_react7.useMemo)(() => {
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
  return /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-anchor", ref: anchor }, /* @__PURE__ */ import_react7.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-plus",
      "aria-label": "\u4E13\u5BB6\xB7\u6280\u80FD\xB7\u8FDE\u63A5\u5668",
      "aria-expanded": menuOpen || pickerOpen || void 0,
      title: "\u4E13\u5BB6 \xB7 \u6280\u80FD \xB7 \u8FDE\u63A5\u5668",
      onClick: () => {
        setMenuOpen((v) => !v);
        setPickerOpen(false);
      }
    },
    /* @__PURE__ */ import_react7.default.createElement(WbIcon, { name: "plus", size: 14 })
  ), menuOpen && /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-popScrim", onClick: () => setMenuOpen(false) }), /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-menu", role: "menu" }, /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-menu-list" }, menuEntries.length === 0 && /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-menu-item is-empty" }, "\u6682\u65E0\u53EF\u9009\u6761\u76EE"), menuEntries.map((e) => /* @__PURE__ */ import_react7.default.createElement(
    "div",
    {
      key: e.key,
      className: "wbh-menu-item",
      role: "menuitem",
      tabIndex: 0,
      "aria-checked": mounted.has(e.key) || void 0,
      onClick: () => {
        setMenuOpen(false);
        onDetail({ kind: e.kind, name: e.name, displayName: e.displayName, icon: e.icon });
      },
      onKeyDown: (ev) => {
        if (ev.key === "Enter") {
          setMenuOpen(false);
          onDetail({ kind: e.kind, name: e.name, displayName: e.displayName, icon: e.icon });
        }
      }
    },
    /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-menu-avatar", "aria-hidden": "true" }, e.icon ? /* @__PURE__ */ import_react7.default.createElement("img", { src: e.icon, alt: "" }) : /* @__PURE__ */ import_react7.default.createElement("span", null, (e.displayName || "?").slice(0, 1))),
    /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-menu-name" }, e.displayName)
  ))), /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-menu-divider", role: "separator" }), /* @__PURE__ */ import_react7.default.createElement(
    "div",
    {
      className: "wbh-menu-item wbh-menu-summonMore",
      role: "menuitem",
      tabIndex: 0,
      onClick: () => openPicker(kind),
      onKeyDown: (ev) => {
        if (ev.key === "Enter") openPicker(kind);
      }
    },
    /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-menu-summonMoreIcon" }, /* @__PURE__ */ import_react7.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ import_react7.default.createElement("path", { d: "M5 4.5h6.5V11", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ import_react7.default.createElement("path", { d: "M11.5 4.5L4.5 11.5", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }))),
    /* @__PURE__ */ import_react7.default.createElement("span", { className: "wbh-menu-summonMoreLabel" }, "\u53EC\u5524\u66F4\u591A", KINDS2.find((k) => k.id === kind)?.label || "")
  ))), pickerOpen && /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-popScrim", onClick: () => setPickerOpen(false) }), /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-pop" }, /* @__PURE__ */ import_react7.default.createElement(
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
      busy
    }
  ), notice && /* @__PURE__ */ import_react7.default.createElement("div", { className: "wbh-popNotice" }, notice))), summoning && /* @__PURE__ */ import_react7.default.createElement(
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
  ));
}

// src/AttachedRail.jsx
var import_react8 = __toESM(require("react"), 1);
function AttachedRail({ sessionId }) {
  const [items, setItems] = (0, import_react8.useState)([]);
  const [busy, setBusy] = (0, import_react8.useState)("");
  const refresh = (0, import_react8.useCallback)(async () => {
    if (!sessionId) {
      setItems([]);
      return;
    }
    try {
      const keys = await hub.mounted(sessionId);
      const installed = await hub.installed();
      setItems(keys.map((key) => {
        const [kind, name] = key.split("/");
        const rec = installed[key] || {};
        return { key, kind, name, displayName: rec.displayName || name, icon: rec.icon || "" };
      }));
    } catch {
    }
  }, [sessionId]);
  (0, import_react8.useEffect)(() => {
    void refresh();
  }, [refresh]);
  (0, import_react8.useEffect)(() => onCatalogChange(refresh), [refresh]);
  if (items.length === 0) return null;
  const detach = async (item) => {
    setBusy(item.key);
    try {
      if (item.kind === "connector") await hub.disableConnector(item.name);
      await hub.unmount(sessionId, item.kind, item.name);
      await refresh();
    } catch {
    } finally {
      setBusy("");
    }
  };
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "wbh-rail" }, items.map((item) => /* @__PURE__ */ import_react8.default.createElement("span", { key: item.key, className: "wbh-railChip", title: `${item.kind}\uFF1A${item.displayName}` }, /* @__PURE__ */ import_react8.default.createElement("span", { className: "wbh-railIcon" }, item.icon ? /* @__PURE__ */ import_react8.default.createElement("img", { src: item.icon, alt: "" }) : /* @__PURE__ */ import_react8.default.createElement(WbIcon, { name: item.kind === "expert" ? "person" : item.kind === "skill" ? "sparkle" : "link", size: 13 })), /* @__PURE__ */ import_react8.default.createElement("span", { className: "wbh-railName" }, item.displayName), /* @__PURE__ */ import_react8.default.createElement(
    "button",
    {
      type: "button",
      className: "wbh-railX",
      disabled: busy === item.key,
      "aria-label": `\u79FB\u9664 ${item.displayName}`,
      onClick: () => void detach(item)
    },
    /* @__PURE__ */ import_react8.default.createElement(WbIcon, { name: "close", size: 11 })
  ))));
}

// src/SettingsPage.jsx
var import_react9 = __toESM(require("react"), 1);
function SettingsPage() {
  const [auth, setAuth] = (0, import_react9.useState)(null);
  const [installed, setInstalled] = (0, import_react9.useState)({});
  const [showAuth, setShowAuth] = (0, import_react9.useState)(false);
  const refresh = (0, import_react9.useCallback)(async () => {
    try {
      setAuth(await hub.auth());
    } catch {
      setAuth({ configured: false });
    }
    try {
      setInstalled(await hub.installed());
    } catch {
    }
  }, []);
  (0, import_react9.useEffect)(() => {
    void refresh();
  }, [refresh]);
  const loggedIn = auth?.configured === true;
  const entries = Object.values(installed);
  return /* @__PURE__ */ import_react9.default.createElement("section", { className: "wbh-settings" }, /* @__PURE__ */ import_react9.default.createElement("h2", { className: "wbh-secTitle" }, "\u817E\u8BAF\u8D26\u53F7\uFF08\u5B98\u65B9\u5E02\u573A\u6570\u636E\uFF09"), /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-row" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-authState" }, /* @__PURE__ */ import_react9.default.createElement("i", { className: `wbh-dot${loggedIn ? "" : " off"}` }), loggedIn ? `\u5DF2\u767B\u5F55${auth?.nickname ? ` \xB7 ${auth.nickname}` : ""}` : "\u672A\u767B\u5F55 \u2014 \u5B98\u65B9\u4E13\u5BB6/\u6280\u80FD\u76EE\u5F55\u4E0E\u7528\u91CF\u6570\u636E\u9700\u8981\u767B\u5F55"), loggedIn ? /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", className: "wbh-btnGhost", onClick: async () => {
    await hub.authLogout();
    await refresh();
  } }, "\u6CE8\u9500") : /* @__PURE__ */ import_react9.default.createElement("button", { type: "button", className: "wbh-btnPrimary", onClick: () => setShowAuth(true) }, "\u626B\u7801\u767B\u5F55")), loggedIn && auth?.expiresAt && /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-row" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-muted" }, "\u6388\u6743\u5230\u671F\uFF1A", new Date(auth.expiresAt).toLocaleString("zh-CN"), "\uFF1Btoken \u5230\u671F\u524D\u81EA\u52A8\u5237\u65B0")), /* @__PURE__ */ import_react9.default.createElement("h2", { className: "wbh-secTitle", style: { marginTop: 22 } }, "\u5DF2\u5B89\u88C5\uFF08", entries.length, "\uFF09"), entries.length === 0 && /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-state" }, /* @__PURE__ */ import_react9.default.createElement("p", null, "\u5728\u8F93\u5165\u6846\u300C\uFF0B\u300D\u6216\u5DE6\u4FA7\u5165\u53E3\u6D4F\u89C8\u5E02\u573A\u3002")), entries.map((entry) => /* @__PURE__ */ import_react9.default.createElement("div", { className: "wbh-row", key: `${entry.kind}/${entry.name}` }, /* @__PURE__ */ import_react9.default.createElement("span", null, entry.displayName || entry.name, /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-muted" }, " \xB7 ", entry.kind)), /* @__PURE__ */ import_react9.default.createElement("span", { className: "wbh-muted" }, entry.files || 0, " \u6587\u4EF6", entry.mcp ? " \xB7 MCP" : "", entry.source === "official" ? " \xB7 \u5B98\u65B9" : ""))), /* @__PURE__ */ import_react9.default.createElement("p", { className: "wbh-muted", style: { marginTop: 16 } }, "\u9700\u8981 OAuth \u6216 API Key \u7684\u8FDE\u63A5\u5668\u4F1A\u5728\u542F\u7528\u65F6\u53D1\u8D77\u72EC\u7ACB\u6388\u6743\uFF1B\u672C\u9875\u4E0E\u6D4F\u89C8\u5668\u7AEF\u4E0D\u4F1A\u5C55\u793A\u4EFB\u4F55\u51ED\u636E\u503C\u3002"), showAuth && /* @__PURE__ */ import_react9.default.createElement(WbAuthCard, { onClose: () => {
    setShowAuth(false);
    void refresh();
  } }));
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
function HubPage(props) {
  return /* @__PURE__ */ import_react10.default.createElement(MarketPage, { sessionId: props?.sessionId, runCommand });
}
function PanelIcon() {
  return /* @__PURE__ */ import_react10.default.createElement(WbIcon, { name: "grid", size: 16 });
}
function ComposerSlot(props) {
  return /* @__PURE__ */ import_react10.default.createElement(ComposerAdd, { sessionId: props?.sessionId, runCommand });
}
function RailSlot(props) {
  return /* @__PURE__ */ import_react10.default.createElement(AttachedRail, { sessionId: props?.sessionId });
}
var plugin = {
  apply(ctx) {
    pluginCtx = ctx;
    const reg = (name, options, component) => ctx.slots.register(options, component);
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
      id: "workbuddy-hub-attached",
      order: -90,
      label: () => "\u5DF2\u6302\u8F7D WorkBuddy \u6761\u76EE"
    }, RailSlot));
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
plugin.inject = ["slots"];
module.exports = plugin;

return module.exports; } });
