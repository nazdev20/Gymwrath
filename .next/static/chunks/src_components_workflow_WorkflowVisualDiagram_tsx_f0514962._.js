(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/workflow/WorkflowVisualDiagram.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkflowVisualDiagram",
    ()=>WorkflowVisualDiagram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-client] (ecmascript) <export default as ZoomOut>");
;
var _s = __turbopack_context__.k.signature();
;
;
const WorkflowVisualDiagram = ()=>{
    _s();
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const downloadAsPng = ()=>{
        if (!svgRef.current) return;
        setDownloading(true);
        try {
            const svgElement = svgRef.current;
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([
                svgString
            ], {
                type: 'image/svg+xml;charset=utf-8'
            });
            const blobURL = window.URL.createObjectURL(svgBlob);
            const image = new Image();
            image.onload = ()=>{
                const canvas = document.createElement('canvas');
                // High resolution 2x scale
                canvas.width = 1600 * 2;
                canvas.height = 1050 * 2;
                const context = canvas.getContext('2d');
                if (context) {
                    context.scale(2, 2);
                    context.fillStyle = '#090d16';
                    context.fillRect(0, 0, 1600, 1050);
                    context.drawImage(image, 0, 0, 1600, 1050);
                    const pngUrl = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'fitness_platform_workflow_diagram.png';
                    downloadLink.href = pngUrl;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    window.URL.revokeObjectURL(blobURL);
                }
                setDownloading(false);
            };
            image.onerror = ()=>{
                setDownloading(false);
                // Fallback: download as SVG
                const downloadLink = document.createElement('a');
                downloadLink.download = 'fitness_platform_workflow_diagram.svg';
                downloadLink.href = blobURL;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            };
            image.src = blobURL;
        } catch (err) {
            console.error('Failed to export diagram image:', err);
            setDownloading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-base font-bold text-white flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        className: "w-5 h-5 text-emerald-400"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 66,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "End-to-End System Workflow Architecture"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-400 mt-0.5",
                                children: "Complete lifecycle map detailing role responsibilities and PostgreSQL database sync"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoom((prev)=>Math.max(0.7, prev - 0.1)),
                                        className: "p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors",
                                        title: "Zoom Out",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-mono px-2 text-slate-300 font-bold",
                                        children: [
                                            Math.round(zoom * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoom((prev)=>Math.min(1.5, prev + 0.1)),
                                        className: "p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors",
                                        title: "Zoom In",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoom(1),
                                        className: "p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-medium",
                                        title: "Reset Zoom",
                                        children: "Reset"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: downloadAsPng,
                                disabled: downloading,
                                className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    downloading ? 'Generating PNG...' : 'Download Image (PNG)'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full overflow-x-auto bg-slate-950 border border-slate-800/80 rounded-2xl p-2 sm:p-4 shadow-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        transform: "scale(".concat(zoom, ")"),
                        transformOrigin: 'top left',
                        minWidth: '1200px'
                    },
                    className: "transition-transform duration-150",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        ref: svgRef,
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 1600 1050",
                        width: "1600",
                        height: "1050",
                        className: "w-full h-auto select-none rounded-xl",
                        style: {
                            backgroundColor: '#090d16',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "bgGrad",
                                        x1: "0%",
                                        y1: "0%",
                                        x2: "100%",
                                        y2: "100%",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#0b1120"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "50%",
                                                stopColor: "#080c18"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#04060d"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "clientGrad",
                                        x1: "0%",
                                        y1: "0%",
                                        x2: "100%",
                                        y2: "0%",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#0284c7"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#38bdf8"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 136,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "coachGrad",
                                        x1: "0%",
                                        y1: "0%",
                                        x2: "100%",
                                        y2: "0%",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#059669"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#10b981"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 141,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "adminGrad",
                                        x1: "0%",
                                        y1: "0%",
                                        x2: "100%",
                                        y2: "0%",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#7c3aed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#a855f7"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                        id: "dbGrad",
                                        x1: "0%",
                                        y1: "0%",
                                        x2: "100%",
                                        y2: "0%",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "0%",
                                                stopColor: "#d97706"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                offset: "100%",
                                                stopColor: "#f59e0b"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                        id: "arrow-blue",
                                        markerWidth: "10",
                                        markerHeight: "10",
                                        refX: "9",
                                        refY: "5",
                                        orient: "auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0,1 L10,5 L0,9 L3,5 Z",
                                            fill: "#38bdf8"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                        id: "arrow-emerald",
                                        markerWidth: "10",
                                        markerHeight: "10",
                                        refX: "9",
                                        refY: "5",
                                        orient: "auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0,1 L10,5 L0,9 L3,5 Z",
                                            fill: "#10b981"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                        id: "arrow-purple",
                                        markerWidth: "10",
                                        markerHeight: "10",
                                        refX: "9",
                                        refY: "5",
                                        orient: "auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0,1 L10,5 L0,9 L3,5 Z",
                                            fill: "#a855f7"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                        id: "arrow-amber",
                                        markerWidth: "10",
                                        markerHeight: "10",
                                        refX: "9",
                                        refY: "5",
                                        orient: "auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M0,1 L10,5 L0,9 L3,5 Z",
                                            fill: "#f59e0b"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                        id: "cardShadow",
                                        x: "-10%",
                                        y: "-10%",
                                        width: "120%",
                                        height: "120%",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feDropShadow", {
                                            dx: "0",
                                            dy: "8",
                                            stdDeviation: "6",
                                            floodColor: "#000000",
                                            floodOpacity: "0.6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 170,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                width: "1600",
                                height: "1050",
                                fill: "url(#bgGrad)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                opacity: "0.12",
                                children: [
                                    Array.from({
                                        length: 32
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: i * 50,
                                            y1: "0",
                                            x2: i * 50,
                                            y2: "1050",
                                            stroke: "#94a3b8",
                                            strokeWidth: "1"
                                        }, "v-".concat(i), false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))),
                                    Array.from({
                                        length: 21
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "0",
                                            y1: i * 50,
                                            x2: "1600",
                                            y2: i * 50,
                                            stroke: "#94a3b8",
                                            strokeWidth: "1"
                                        }, "h-".concat(i), false, {
                                            fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(60, 45)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "1480",
                                        height: "75",
                                        rx: "16",
                                        fill: "#0f172a",
                                        stroke: "#1e293b",
                                        strokeWidth: "1.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "45",
                                        cy: "37.5",
                                        r: "20",
                                        fill: "#10b981",
                                        fillOpacity: "0.2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M38 37.5 L43 42.5 L52 32.5",
                                        fill: "none",
                                        stroke: "#10b981",
                                        strokeWidth: "3",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "80",
                                        y: "34",
                                        fill: "#ffffff",
                                        fontSize: "22",
                                        fontWeight: "800",
                                        children: "FITNESS COACHING PLATFORM - END-TO-END WORKFLOW DIAGRAM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "80",
                                        y: "55",
                                        fill: "#94a3b8",
                                        fontSize: "13",
                                        fontWeight: "500",
                                        children: "Multi-Role Operational Flow (Client, Coach, Admin) with PostgreSQL Data Sync Lifecycle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "1310",
                                        y: "22",
                                        width: "140",
                                        height: "32",
                                        rx: "8",
                                        fill: "#1e293b",
                                        stroke: "#334155"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "1380",
                                        y: "42",
                                        fill: "#38bdf8",
                                        fontSize: "11",
                                        fontWeight: "700",
                                        textAnchor: "middle",
                                        children: "LIVE PRODUCTION"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(60, 140)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "850",
                                        rx: "18",
                                        fill: "#0c192c",
                                        fillOpacity: "0.7",
                                        stroke: "#0284c7",
                                        strokeWidth: "2",
                                        strokeOpacity: "0.4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "56",
                                        rx: "18",
                                        fill: "url(#clientGrad)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "35",
                                        fill: "#ffffff",
                                        fontSize: "18",
                                        fontWeight: "800",
                                        textAnchor: "middle",
                                        letterSpacing: "1",
                                        children: "🏃 CLIENT ROLE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "85",
                                        fill: "#7dd3fc",
                                        fontSize: "12",
                                        fontWeight: "600",
                                        textAnchor: "middle",
                                        children: "Execution, Logging & Biofeedback"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 213,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 110)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "120",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#0284c7",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 219,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#0284c7",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 220,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#38bdf8",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Account Self-Registration"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 222,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Enters fitness goals, baseline weight, height, & contact info."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 223,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "80",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#022c44",
                                                stroke: "#0369a1",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 226,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "97",
                                                fill: "#7dd3fc",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB Table: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#38bdf8",
                                                        fontWeight: "700",
                                                        children: "profiles"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " (status: 'pending')"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 330)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "120",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#0284c7",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 234,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#0284c7",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#38bdf8",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Daily Plan & Macro Targets"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Views scheduled workout calendar and target Cal/P/C/F macros."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "80",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#022c44",
                                                stroke: "#0369a1",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 241,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "97",
                                                fill: "#7dd3fc",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#38bdf8",
                                                        fontWeight: "700",
                                                        children: "workout_assignments, nutrition_plans"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 490)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "125",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#0284c7",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#0284c7",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 250,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#38bdf8",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 251,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Active Workout & Step Logging"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Logs live sets, weights, reps, RPE, daily steps & consumed meals."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 253,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "85",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#022c44",
                                                stroke: "#0369a1",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 256,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "102",
                                                fill: "#7dd3fc",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#38bdf8",
                                                        fontWeight: "700",
                                                        children: "workout_completions, progress_records"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 680)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "135",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#f59e0b",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 264,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#f59e0b",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 265,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#fbbf24",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Weekly Check-In Submission"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Submits weight, sleep, stress, energy, hunger & athlete notes."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 268,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "95",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#451a03",
                                                stroke: "#b45309",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "112",
                                                fill: "#fcd34d",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#f59e0b",
                                                        fontWeight: "700",
                                                        children: "check_ins"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " (status: 'submitted')"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(570, 140)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "850",
                                        rx: "18",
                                        fill: "#061c16",
                                        fillOpacity: "0.7",
                                        stroke: "#059669",
                                        strokeWidth: "2",
                                        strokeOpacity: "0.4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "56",
                                        rx: "18",
                                        fill: "url(#coachGrad)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "35",
                                        fill: "#ffffff",
                                        fontSize: "18",
                                        fontWeight: "800",
                                        textAnchor: "middle",
                                        letterSpacing: "1",
                                        children: "🏋️ COACH ROLE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "85",
                                        fill: "#6ee7b7",
                                        fontSize: "12",
                                        fontWeight: "600",
                                        textAnchor: "middle",
                                        children: "Programming, Live Monitoring & Feedback"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 230)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "135",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#059669",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 291,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#059669",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 292,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#34d399",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Training & Nutrition Programming"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Selects exercises, configures multi-week splits, sets macro goals."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "95",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#064e3b",
                                                stroke: "#047857",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 298,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "112",
                                                fill: "#6ee7b7",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#34d399",
                                                        fontWeight: "700",
                                                        children: "training_programs, nutrition_plans"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 470)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "120",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#059669",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "29",
                                                cy: "29",
                                                r: "14",
                                                fill: "#10b981",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 307,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "29",
                                                cy: "29",
                                                r: "6",
                                                fill: "#10b981"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 308,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Live Adherence & Compliance"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Real-time sync: receives completion alerts & workout logs."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "80",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#064e3b",
                                                stroke: "#047857",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 313,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "97",
                                                fill: "#6ee7b7",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: "Real-time compliance calculation & notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 314,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 680)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "135",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#059669",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 321,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#059669",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 322,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#34d399",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "7"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 323,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Check-In Review & Feedback"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 324,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Analyzes metrics, sends video/text feedback & updates next week."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "95",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#064e3b",
                                                stroke: "#047857",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 328,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "112",
                                                fill: "#6ee7b7",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#34d399",
                                                        fontWeight: "700",
                                                        children: "check_ins (reviewed), messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 329,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                transform: "translate(1080, 140)",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "850",
                                        rx: "18",
                                        fill: "#1b0c2e",
                                        fillOpacity: "0.7",
                                        stroke: "#7c3aed",
                                        strokeWidth: "2",
                                        strokeOpacity: "0.4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 337,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "0",
                                        y: "0",
                                        width: "460",
                                        height: "56",
                                        rx: "18",
                                        fill: "url(#adminGrad)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 338,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "35",
                                        fill: "#ffffff",
                                        fontSize: "18",
                                        fontWeight: "800",
                                        textAnchor: "middle",
                                        letterSpacing: "1",
                                        children: "🛡️ ADMINISTRATOR ROLE"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 339,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: "230",
                                        y: "85",
                                        fill: "#d8b4fe",
                                        fontSize: "12",
                                        fontWeight: "600",
                                        textAnchor: "middle",
                                        children: "Platform Governance & Coach Pairing"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 342,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 110)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "135",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#7c3aed",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 348,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "15",
                                                y: "15",
                                                width: "28",
                                                height: "28",
                                                rx: "8",
                                                fill: "#7c3aed",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "29",
                                                y: "34",
                                                fill: "#c084fc",
                                                fontSize: "14",
                                                fontWeight: "800",
                                                textAnchor: "middle",
                                                children: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 350,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Client Approval & Coach Pairing"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 351,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Reviews registration queue, approves client, assigns coach."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 352,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "95",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#3b0764",
                                                stroke: "#6b21a8",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 355,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "112",
                                                fill: "#d8b4fe",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#c084fc",
                                                        fontWeight: "700",
                                                        children: "coach_client_assignments, conversations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 356,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 330)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "125",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#7c3aed",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 363,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "29",
                                                cy: "29",
                                                r: "14",
                                                fill: "#a855f7",
                                                fillOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 364,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M22 29 L27 34 L36 24",
                                                fill: "none",
                                                stroke: "#a855f7",
                                                strokeWidth: "2.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "55",
                                                y: "34",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Database & System Health"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Maintains PostgreSQL schemas, table integrity, global audits."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 367,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "85",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#3b0764",
                                                stroke: "#6b21a8",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 370,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "102",
                                                fill: "#d8b4fe",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: [
                                                    "DB: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tspan", {
                                                        fill: "#c084fc",
                                                        fontWeight: "700",
                                                        children: "system_settings, audit_logs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 371,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 362,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        transform: "translate(25, 530)",
                                        filter: "url(#cardShadow)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "0",
                                                y: "0",
                                                width: "410",
                                                height: "120",
                                                rx: "14",
                                                fill: "#0f172a",
                                                stroke: "#7c3aed",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 378,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "35",
                                                fill: "#ffffff",
                                                fontSize: "15",
                                                fontWeight: "700",
                                                children: "Organization Overview"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 379,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "20",
                                                y: "65",
                                                fill: "#94a3b8",
                                                fontSize: "12",
                                                children: "Monitors coach caseloads, athlete compliance rates, platform retention."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 380,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "20",
                                                y: "80",
                                                width: "370",
                                                height: "26",
                                                rx: "6",
                                                fill: "#3b0764",
                                                stroke: "#6b21a8",
                                                strokeWidth: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 383,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                x: "30",
                                                y: "97",
                                                fill: "#d8b4fe",
                                                fontSize: "11",
                                                fontWeight: "600",
                                                children: "Cross-roster analytics & exercise library oversight"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                                lineNumber: 384,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                        lineNumber: 377,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 336,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 495 310 Q 780 260 1105 310",
                                fill: "none",
                                stroke: "#38bdf8",
                                strokeWidth: "2.5",
                                strokeDasharray: "6 4",
                                markerEnd: "url(#arrow-purple)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 392,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 1105 400 Q 1050 420 1005 420",
                                fill: "none",
                                stroke: "#a855f7",
                                strokeWidth: "2.5",
                                markerEnd: "url(#arrow-emerald)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 402,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 595 440 Q 545 450 495 500",
                                fill: "none",
                                stroke: "#10b981",
                                strokeWidth: "2.5",
                                markerEnd: "url(#arrow-blue)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 495 675 Q 545 675 595 675",
                                fill: "none",
                                stroke: "#38bdf8",
                                strokeWidth: "2.5",
                                markerEnd: "url(#arrow-emerald)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 495 890 Q 545 890 595 890",
                                fill: "none",
                                stroke: "#f59e0b",
                                strokeWidth: "3",
                                markerEnd: "url(#arrow-amber)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 429,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 595 915 Q 545 935 495 915",
                                fill: "none",
                                stroke: "#10b981",
                                strokeWidth: "2.5",
                                strokeDasharray: "6 4",
                                markerEnd: "url(#arrow-blue)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                                lineNumber: 438,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/workflow/WorkflowVisualDiagram.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(WorkflowVisualDiagram, "qogVg4wezx6sOWWmCkpk0qctBa0=");
_c = WorkflowVisualDiagram;
var _c;
__turbopack_context__.k.register(_c, "WorkflowVisualDiagram");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_workflow_WorkflowVisualDiagram_tsx_f0514962._.js.map