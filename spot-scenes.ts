export type ShapeTag = "circle" | "ellipse" | "rect" | "path" | "polygon" | "line";

export type SceneShape = {
  tag: ShapeTag;
  attrs: Record<string, string | number>;
};

export type SceneElement = {
  id: string;
  shapes: SceneShape[];
  rightShapes?: SceneShape[];
  only?: "left" | "right";
};

export type SceneDifference = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
};

export type SpotScene = {
  id: string;
  title: string;
  subtitle: string;
  sky: string;
  elements: SceneElement[];
  differences: SceneDifference[];
};

const rect = (x: number, y: number, width: number, height: number, fill: string, extra: Record<string, string | number> = {}): SceneShape => ({
  tag: "rect",
  attrs: { x, y, width, height, fill, ...extra },
});

const circle = (cx: number, cy: number, r: number, fill: string, extra: Record<string, string | number> = {}): SceneShape => ({
  tag: "circle",
  attrs: { cx, cy, r, fill, ...extra },
});

const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, extra: Record<string, string | number> = {}): SceneShape => ({
  tag: "ellipse",
  attrs: { cx, cy, rx, ry, fill, ...extra },
});

const path = (d: string, fill: string, extra: Record<string, string | number> = {}): SceneShape => ({
  tag: "path",
  attrs: { d, fill, ...extra },
});

const polygon = (points: string, fill: string, extra: Record<string, string | number> = {}): SceneShape => ({
  tag: "polygon",
  attrs: { points, fill, ...extra },
});

const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, width = 2): SceneShape => ({
  tag: "line",
  attrs: { x1, y1, x2, y2, stroke, strokeWidth: width, strokeLinecap: "round" },
});

export const VIEW_W = 400;
export const VIEW_H = 280;

const gardenScene: SpotScene = {
  id: "garden",
  title: "Күншуақ бақ",
  subtitle: "Бақтағы кішкентай құпияларды тап",
  sky: "#E9F6FF",
  elements: [
    { id: "sky", shapes: [rect(0, 0, VIEW_W, VIEW_H, "#E9F6FF")] },
    {
      id: "ground",
      shapes: [
        ellipse(90, 214, 156, 74, "#D3F1E4"),
        ellipse(322, 220, 172, 84, "#C3ECDC"),
        path(`M0 206 H400 V280 H0 Z`, "#E3F8ED"),
        ellipse(200, 270, 104, 26, "#F6E8CC"),
      ],
    },
    {
      id: "sun",
      only: "left",
      shapes: [
        circle(332, 48, 36, "#FFE9B8", { opacity: 0.75 }),
        circle(332, 48, 24, "#FFC246"),
        circle(324, 42, 6, "#FFDB8A"),
      ],
    },
    {
      id: "cloudA",
      shapes: [
        ellipse(76, 46, 28, 15, "#FFFFFF"),
        ellipse(104, 40, 21, 12, "#FFFFFF"),
        ellipse(56, 50, 17, 10, "#FFFFFF"),
      ],
    },
    {
      id: "cloudB",
      shapes: [ellipse(252, 32, 24, 13, "#FFFFFF"), ellipse(274, 27, 17, 10, "#FFFFFF")],
    },
    {
      id: "tree",
      shapes: [
        rect(64, 148, 16, 64, "#A06B43", { rx: 6 }),
        circle(72, 146, 33, "#4EC5A8"),
        circle(47, 166, 21, "#3FB89B"),
        circle(97, 166, 21, "#3FB89B"),
        ellipse(72, 214, 28, 8, "#9FDCC9", { opacity: 0.55 }),
      ],
    },
    {
      id: "apples",
      shapes: [circle(64, 132, 8, "#EF6B6B"), circle(88, 148, 8, "#EF6B6B"), circle(56, 158, 8, "#EF6B6B")],
      rightShapes: [circle(64, 132, 8, "#EF6B6B"), circle(88, 148, 8, "#EF6B6B")],
    },
    {
      id: "house",
      shapes: [
        rect(232, 150, 112, 84, "#FFFFFF", { rx: 8, stroke: "#E4EAF6", strokeWidth: 2 }),
        polygon("222,152 288,102 354,152", "#9271E8", { strokeLinejoin: "round" }),
        polygon("288,102 354,152 326,152 288,122", "#7D59DA"),
        rect(310, 112, 16, 32, "#7D59DA", { rx: 4 }),
        rect(272, 190, 30, 44, "#26B6B2", { rx: 10 }),
        circle(296, 212, 3.5, "#F7B23B"),
        rect(232, 214, 112, 20, "#F1F5FD"),
      ],
    },
    {
      id: "window",
      shapes: [
        rect(244, 164, 36, 32, "#BFE9F7", { rx: 8, stroke: "#FFFFFF", strokeWidth: 3 }),
        line(262, 164, 262, 196, "#FFFFFF", 2.5),
        line(244, 180, 280, 180, "#FFFFFF", 2.5),
      ],
      rightShapes: [
        rect(244, 164, 36, 32, "#FFD9A8", { rx: 8, stroke: "#FFFFFF", strokeWidth: 3 }),
        line(262, 164, 262, 196, "#FFFFFF", 2.5),
        line(244, 180, 280, 180, "#FFFFFF", 2.5),
      ],
    },
    {
      id: "fence",
      shapes: [
        rect(356, 206, 9, 36, "#FFFFFF", { rx: 3, stroke: "#E4EAF6", strokeWidth: 1.5 }),
        rect(374, 206, 9, 36, "#FFFFFF", { rx: 3, stroke: "#E4EAF6", strokeWidth: 1.5 }),
        rect(392, 206, 9, 36, "#FFFFFF", { rx: 3, stroke: "#E4EAF6", strokeWidth: 1.5 }),
        rect(352, 216, 56, 6, "#FFFFFF", { rx: 3, stroke: "#E4EAF6", strokeWidth: 1.5 }),
      ],
    },
    {
      id: "flowers",
      shapes: [
        line(118, 246, 118, 264, "#3FB89B", 2.5),
        circle(118, 241, 7, "#F272A8"),
        circle(118, 241, 3, "#FFE9A8"),
        line(140, 252, 140, 268, "#3FB89B", 2.5),
        circle(140, 247, 7, "#F272A8"),
        circle(140, 247, 3, "#FFE9A8"),
        line(100, 254, 100, 268, "#3FB89B", 2.5),
        circle(100, 249, 7, "#F272A8"),
        circle(100, 249, 3, "#FFE9A8"),
      ],
    },
    {
      id: "balloon",
      shapes: [
        path("M156 124 Q 150 140 156 146 Q 162 140 156 124 Z", "#F272A8"),
        ellipse(156, 104, 18, 22, "#F272A8"),
        ellipse(151, 97, 5, 7, "#FFD3E4", { opacity: 0.9 }),
        line(154, 146, 150, 160, "#C98A11", 1.5),
      ],
      rightShapes: [
        path("M156 124 Q 150 140 156 146 Q 162 140 156 124 Z", "#26B6B2"),
        ellipse(156, 104, 18, 22, "#26B6B2"),
        ellipse(151, 97, 5, 7, "#CFF3F1", { opacity: 0.9 }),
        line(154, 146, 150, 160, "#C98A11", 1.5),
      ],
    },
    {
      id: "butterfly",
      only: "left",
      shapes: [
        ellipse(212, 62, 9, 12, "#F7B23B", { transform: "rotate(-22 212 62)" }),
        ellipse(228, 62, 9, 12, "#F7B23B", { transform: "rotate(22 228 62)" }),
        ellipse(212, 78, 7, 9, "#FFD887", { transform: "rotate(-16 212 78)" }),
        ellipse(228, 78, 7, 9, "#FFD887", { transform: "rotate(16 228 78)" }),
        line(220, 60, 220, 84, "#9A6608", 2),
      ],
    },
  ],
  differences: [
    { id: "d-sun", label: "Күн екінші суретте көрінбейді", x: 332, y: 48, r: 34 },
    { id: "d-balloon", label: "Шардың түсі өзгерген", x: 156, y: 104, r: 24 },
    { id: "d-window", label: "Терезенің түсі басқа", x: 262, y: 180, r: 24 },
    { id: "d-apple", label: "Алманың біреуі жоқ", x: 56, y: 158, r: 19 },
    { id: "d-butterfly", label: "Көбелек ұшып кеткен", x: 220, y: 70, r: 22 },
  ],
};

const beachScene: SpotScene = {
  id: "beach",
  title: "Теңіз жағасы",
  subtitle: "Жазғы демалыстағы айырмашылықтар",
  sky: "#E7F6FF",
  elements: [
    { id: "sky", shapes: [rect(0, 0, VIEW_W, VIEW_H, "#E7F6FF")] },
    {
      id: "sun",
      shapes: [circle(58, 44, 34, "#FFE9B8", { opacity: 0.8 }), circle(58, 44, 22, "#FFC246")],
    },
    {
      id: "clouds",
      shapes: [
        ellipse(196, 34, 26, 14, "#FFFFFF"),
        ellipse(220, 28, 18, 11, "#FFFFFF"),
        ellipse(320, 44, 20, 11, "#FFFFFF"),
        ellipse(340, 39, 14, 9, "#FFFFFF"),
      ],
    },
    {
      id: "sea",
      shapes: [
        rect(0, 128, VIEW_W, 78, "#7FDDE6"),
        rect(0, 152, VIEW_W, 54, "#63CFDB"),
        path("M16 150 q14 -8 28 0 t28 0 t28 0", "none", { stroke: "#FFFFFF", strokeWidth: 3, strokeLinecap: "round", opacity: 0.6 }),
        path("M256 138 q14 -8 28 0 t28 0 t28 0", "none", { stroke: "#FFFFFF", strokeWidth: 3, strokeLinecap: "round", opacity: 0.55 }),
      ],
    },
    {
      id: "sand",
      shapes: [
        path("M0 192 Q 96 172 200 194 T 400 190 V280 H0 Z", "#FBEBC9"),
        ellipse(200, 258, 150, 26, "#F5E0B4", { opacity: 0.65 }),
      ],
    },
    {
      id: "boat",
      shapes: [
        path("M214 176 L282 176 L268 192 L228 192 Z", "#F5F7FB", { stroke: "#D9E2F2", strokeWidth: 2 }),
        line(248, 176, 248, 132, "#9A6B45", 3),
        polygon("248,132 248,170 282,170", "#FFFFFF"),
        path("M24 172 q10 -10 20 0", "none", { stroke: "#FFFFFF", strokeWidth: 3, strokeLinecap: "round", opacity: 0.8 }),
      ],
      rightShapes: [
        path("M214 176 L282 176 L268 192 L228 192 Z", "#F5F7FB", { stroke: "#D9E2F2", strokeWidth: 2 }),
        line(248, 176, 248, 132, "#9A6B45", 3),
        polygon("248,132 248,170 282,170", "#FFE29A"),
        path("M24 172 q10 -10 20 0", "none", { stroke: "#FFFFFF", strokeWidth: 3, strokeLinecap: "round", opacity: 0.8 }),
      ],
    },
    {
      id: "palm",
      shapes: [
        path("M300 208 C 296 168 306 132 326 108", "none", { stroke: "#A06B43", strokeWidth: 9, strokeLinecap: "round" }),
        ellipse(318, 102, 30, 12, "#3FB89B", { transform: "rotate(-24 318 102)" }),
        ellipse(342, 108, 27, 11, "#4EC5A8", { transform: "rotate(16 342 108)" }),
        ellipse(304, 88, 23, 10, "#4EC5A8", { transform: "rotate(-62 304 88)" }),
        circle(324, 112, 6, "#C98A11"),
        circle(334, 114, 6, "#C98A11"),
      ],
    },
    {
      id: "umbrella",
      shapes: [
        line(100, 128, 100, 208, "#9A6B45", 4),
        path("M56 132 Q 100 88 144 132 Z", "#F272A8"),
        path("M100 110 L100 132 L122 132 Q 114 116 100 110 Z", "#FFD3E4"),
        path("M100 110 L100 132 L78 132 Q 86 116 100 110 Z", "#FFD3E4"),
        ellipse(100, 210, 18, 5, "#E4D4B0"),
      ],
      rightShapes: [
        line(100, 128, 100, 208, "#9A6B45", 4),
        path("M56 132 Q 100 88 144 132 Z", "#9271E8"),
        path("M100 110 L100 132 L122 132 Q 114 116 100 110 Z", "#DCCCFF"),
        path("M100 110 L100 132 L78 132 Q 86 116 100 110 Z", "#DCCCFF"),
        ellipse(100, 210, 18, 5, "#E4D4B0"),
      ],
    },
    {
      id: "ball",
      shapes: [
        circle(198, 238, 19, "#FFFFFF", { stroke: "#E4EAF6", strokeWidth: 2 }),
        path("M198 219 A 19 19 0 0 1 198 257 Z", "#EF6B6B"),
        path("M198 238 L198 257 A 19 19 0 0 0 214 228 Z", "#26B6B2"),
      ],
      rightShapes: [
        circle(198, 238, 19, "#FFFFFF", { stroke: "#E4EAF6", strokeWidth: 2 }),
        path("M198 219 A 19 19 0 0 1 198 257 Z", "#F7B23B"),
        path("M198 238 L198 257 A 19 19 0 0 0 214 228 Z", "#9271E8"),
      ],
    },
    {
      id: "starfish",
      only: "left",
      shapes: [
        polygon("112,238 118,250 132,251 121,259 125,272 112,264 99,272 103,259 92,251 106,250", "#F7B23B", { stroke: "#E8A72B", strokeWidth: 1.5 }),
        circle(112, 253, 2.5, "#E8A72B"),
      ],
    },
    {
      id: "seagull",
      only: "left",
      shapes: [
        path("M276 60 q10 -10 20 0 q10 -10 20 0", "none", { stroke: "#7D8AA8", strokeWidth: 3, strokeLinecap: "round" }),
        path("M310 82 q8 -8 16 0 q8 -8 16 0", "none", { stroke: "#7D8AA8", strokeWidth: 2.5, strokeLinecap: "round" }),
      ],
    },
    {
      id: "castle",
      shapes: [
        rect(322, 214, 52, 36, "#F5DEB0", { rx: 4 }),
        rect(316, 198, 18, 20, "#F0D19B", { rx: 3 }),
        rect(362, 202, 18, 16, "#F0D19B", { rx: 3 }),
        rect(340, 196, 22, 22, "#F7E6C4", { rx: 3 }),
        path("M336 196 L322 196 L322 186 Z", "#F5DEB0"),
        path("M336 196 L346 196 L336 182 Z", "#F5DEB0"),
        line(344, 178, 344, 194, "#9A6B45", 2),
        polygon("344,178 358,184 344,190", "#26B6B2"),
      ],
      rightShapes: [
        rect(322, 214, 52, 36, "#F5DEB0", { rx: 4 }),
        rect(316, 198, 18, 20, "#F0D19B", { rx: 3 }),
        rect(362, 202, 18, 16, "#F0D19B", { rx: 3 }),
        rect(340, 196, 22, 22, "#F7E6C4", { rx: 3 }),
        path("M336 196 L322 196 L322 186 Z", "#F5DEB0"),
        path("M336 196 L346 196 L336 182 Z", "#F5DEB0"),
        line(344, 178, 344, 194, "#9A6B45", 2),
        polygon("344,178 358,184 344,190", "#F7B23B"),
      ],
    },
    {
      id: "bucket",
      shapes: [
        rect(62, 226, 24, 22, "#26B6B2", { rx: 4 }),
        ellipse(74, 226, 12, 4, "#189A97"),
        path("M64 228 q10 -16 20 0", "none", { stroke: "#189A97", strokeWidth: 2 }),
        rect(86, 236, 16, 10, "#F7B23B", { rx: 3 }),
      ],
      rightShapes: [
        rect(62, 226, 24, 22, "#26B6B2", { rx: 4 }),
        ellipse(74, 226, 12, 4, "#189A97"),
        rect(86, 236, 16, 10, "#F7B23B", { rx: 3 }),
      ],
    },
  ],
  differences: [
    { id: "d-umbrella", label: "Қолшатырдың түсі өзгерген", x: 100, y: 122, r: 30 },
    { id: "d-ball", label: "Доптың түсі басқа", x: 198, y: 238, r: 23 },
    { id: "d-starfish", label: "Теңіз жұлдызы жоғалған", x: 112, y: 252, r: 20 },
    { id: "d-gull", label: "Шағала ұшып кеткен", x: 288, y: 62, r: 26 },
    { id: "d-sail", label: "Желкеннің түсі өзгерген", x: 258, y: 152, r: 24 },
    { id: "d-flag", label: "Қамалдағы ту түрлі түсті", x: 350, y: 184, r: 17 },
    { id: "d-bucket", label: "Шелектің тұтқасы жоқ", x: 74, y: 216, r: 18 },
  ],
};

const forestScene: SpotScene = {
  id: "forest",
  title: "Түнгі ертегі орманы",
  subtitle: "Он ұсақ айырмашылықты байқа",
  sky: "#26355C",
  elements: [
    { id: "sky", shapes: [rect(0, 0, VIEW_W, VIEW_H, "#26355C")] },
    {
      id: "skyGlow",
      shapes: [
        circle(330, 52, 60, "#33456F", { opacity: 0.7 }),
        rect(0, 168, VIEW_W, 112, "#1F2C4C"),
      ],
    },
    {
      id: "stars",
      shapes: [
        circle(36, 34, 2.5, "#FFF3C4"),
        circle(80, 58, 2, "#FFF3C4"),
        circle(120, 28, 2.5, "#FFF3C4"),
        circle(168, 52, 2, "#FFF3C4"),
        circle(206, 30, 2.5, "#FFF3C4"),
        circle(250, 58, 2.5, "#FFF3C4"),
        circle(288, 26, 2, "#FFF3C4"),
        circle(372, 96, 2.5, "#FFF3C4"),
        circle(146, 88, 2, "#FFF3C4"),
      ],
      rightShapes: [
        circle(36, 34, 2.5, "#FFF3C4"),
        circle(80, 58, 2, "#FFF3C4"),
        circle(120, 28, 2.5, "#FFF3C4"),
        circle(168, 52, 2, "#FFF3C4"),
        circle(206, 30, 2.5, "#FFF3C4"),
        circle(288, 26, 2, "#FFF3C4"),
        circle(372, 96, 2.5, "#FFF3C4"),
        circle(146, 88, 2, "#FFF3C4"),
      ],
    },
    {
      id: "moon",
      shapes: [circle(322, 46, 26, "#FFE9A8"), circle(312, 40, 5, "#F2D98D")],
      rightShapes: [circle(322, 46, 26, "#FFE9A8")],
    },
    {
      id: "hills",
      shapes: [
        ellipse(80, 204, 160, 80, "#2A3D64"),
        ellipse(330, 210, 180, 88, "#2F4570"),
        polygon("60,180 100,118 140,180", "#233457"),
        polygon("130,186 176,112 222,186", "#1F3050"),
        polygon("268,182 310,124 352,182", "#233457"),
        rect(0, 186, VIEW_W, 94, "#20304F"),
      ],
    },
    {
      id: "cabin",
      shapes: [
        rect(238, 150, 96, 74, "#F3E4C8", { rx: 6 }),
        polygon("228,152 286,110 344,152", "#4A3560"),
        polygon("286,110 344,152 316,152 286,130", "#3D2B50"),
        rect(302, 118, 12, 26, "#3D2B50", { rx: 3 }),
        rect(258, 186, 24, 38, "#9A6B45", { rx: 4 }),
        circle(278, 206, 2.5, "#FFD777"),
        rect(304, 176, 22, 20, "#5B6990", { rx: 4, stroke: "#3D2B50", strokeWidth: 2 }),
        rect(238, 216, 96, 8, "#D9C7A6"),
      ],
    },
    {
      id: "window",
      shapes: [
        rect(256, 172, 28, 24, "#FFD777", { rx: 5 }),
        line(270, 172, 270, 196, "#F3E4C8", 2),
        line(256, 184, 284, 184, "#F3E4C8", 2),
      ],
      rightShapes: [
        rect(256, 172, 28, 24, "#5B6990", { rx: 5 }),
        line(270, 172, 270, 196, "#F3E4C8", 2),
        line(256, 184, 284, 184, "#F3E4C8", 2),
      ],
    },
    {
      id: "smoke",
      shapes: [
        circle(308, 106, 8, "#8EA0C4", { opacity: 0.65 }),
        circle(316, 90, 10, "#8EA0C4", { opacity: 0.5 }),
        circle(326, 72, 12, "#8EA0C4", { opacity: 0.35 }),
      ],
      rightShapes: [
        circle(308, 106, 8, "#8EA0C4", { opacity: 0.65 }),
        circle(326, 72, 12, "#8EA0C4", { opacity: 0.35 }),
      ],
    },
    {
      id: "pond",
      shapes: [
        ellipse(196, 242, 74, 22, "#33557C"),
        ellipse(196, 242, 52, 14, "#3C628C"),
        circle(196, 240, 8, "#FFE9A8", { opacity: 0.55 }),
        ellipse(70, 258, 34, 9, "#2C4868"),
      ],
      rightShapes: [
        ellipse(196, 242, 74, 22, "#33557C"),
        ellipse(196, 242, 52, 14, "#3C628C"),
        ellipse(70, 258, 34, 9, "#2C4868"),
      ],
    },
    {
      id: "mushrooms",
      shapes: [
        rect(110, 232, 10, 20, "#F3E4C8", { rx: 4 }),
        ellipse(115, 230, 18, 10, "#F272A8"),
        circle(112, 228, 2.5, "#FFFFFF"),
        rect(136, 240, 8, 15, "#F3E4C8", { rx: 3 }),
        ellipse(140, 238, 13, 8, "#F272A8"),
        circle(138, 236, 2, "#FFFFFF"),
      ],
      rightShapes: [
        rect(110, 232, 10, 20, "#F3E4C8", { rx: 4 }),
        ellipse(115, 230, 18, 10, "#9271E8"),
        circle(112, 228, 2.5, "#FFFFFF"),
        rect(136, 240, 8, 15, "#F3E4C8", { rx: 3 }),
        ellipse(140, 238, 13, 8, "#F272A8"),
        circle(138, 236, 2, "#FFFFFF"),
      ],
    },
    {
      id: "fox",
      only: "left",
      shapes: [
        ellipse(338, 248, 22, 12, "#E8834A"),
        circle(318, 238, 12, "#E8834A"),
        polygon("310,230 312,220 320,228", "#E8834A"),
        polygon("322,228 328,220 330,230", "#E8834A"),
        circle(315, 237, 1.8, "#26355C"),
        circle(322, 237, 1.8, "#26355C"),
        path("M356 244 q14 -12 6 -22 q-10 4 -8 18", "#F3A96F"),
        circle(328, 242, 2, "#26355C"),
      ],
    },
    {
      id: "fireflies",
      shapes: [
        circle(150, 148, 3.5, "#FFE9A8"),
        circle(150, 148, 8, "#FFE9A8", { opacity: 0.2 }),
        circle(186, 120, 3, "#FFE9A8"),
        circle(186, 120, 7, "#FFE9A8", { opacity: 0.2 }),
      ],
      rightShapes: [circle(186, 120, 3, "#FFE9A8"), circle(186, 120, 7, "#FFE9A8", { opacity: 0.2 })],
    },
    {
      id: "flowers",
      shapes: [
        line(46, 236, 46, 258, "#5A9C86", 2),
        circle(46, 232, 7, "#BFE9F7"),
        circle(46, 232, 3, "#FFE9A8"),
        line(60, 248, 60, 264, "#5A9C86", 2),
        circle(60, 244, 6, "#DCCCFF"),
        circle(60, 244, 2.5, "#FFE9A8"),
      ],
      rightShapes: [
        line(46, 236, 46, 258, "#5A9C86", 2),
        circle(46, 232, 7, "#DCCCFF"),
        circle(46, 232, 3, "#FFE9A8"),
        line(60, 248, 60, 264, "#5A9C86", 2),
        circle(60, 244, 6, "#DCCCFF"),
        circle(60, 244, 2.5, "#FFE9A8"),
      ],
    },
    {
      id: "fence",
      shapes: [
        rect(158, 216, 7, 30, "#C7B696", { rx: 2 }),
        rect(176, 214, 7, 32, "#C7B696", { rx: 2 }),
        rect(194, 216, 7, 30, "#C7B696", { rx: 2 }),
        rect(152, 224, 56, 5, "#C7B696", { rx: 2 }),
      ],
      rightShapes: [
        rect(158, 216, 7, 30, "#C7B696", { rx: 2 }),
        rect(194, 216, 7, 30, "#C7B696", { rx: 2 }),
        rect(152, 224, 56, 5, "#C7B696", { rx: 2 }),
      ],
    },
  ],
  differences: [
    { id: "d-star", label: "Бір жұлдыз сөнген", x: 250, y: 58, r: 15 },
    { id: "d-crater", label: "Айдағы дақ жоғалған", x: 312, y: 40, r: 13 },
    { id: "d-smoke", label: "Түтіннің бір бұйығы жоқ", x: 316, y: 90, r: 16 },
    { id: "d-light", label: "Терезе жарығы сөнген", x: 270, y: 184, r: 20 },
    { id: "d-mushroom", label: "Саңырауқұлақ қалпағының түсі басқа", x: 115, y: 230, r: 16 },
    { id: "d-fox", label: "Түлкі жоғалған", x: 332, y: 246, r: 26 },
    { id: "d-firefly", label: "Отшашқан бір ұшқын жоқ", x: 150, y: 148, r: 15 },
    { id: "d-pond", label: "Көлдегі жарық шағылысы жоқ", x: 196, y: 240, r: 20 },
    { id: "d-flower", label: "Гүлдің түсі өзгерген", x: 46, y: 232, r: 15 },
    { id: "d-post", label: "Қоршаудың бір бағаны жоқ", x: 176, y: 224, r: 15 },
  ],
};

export const SPOT_SCENES: SpotScene[] = [gardenScene, beachScene, forestScene];
