#version 100
precision mediump float;

/** @resolution */
uniform vec2 u_resolution;

/** @time */
uniform float u_time;

/**
 * @label Accent Color
 * @color
 * @default #3A5FC0
 */
uniform vec3 u_accent;

/**
 * @label Muted Color
 * @color
 * @default #E3E4E5
 */
uniform vec3 u_muted;

/**
 * @label Intensity
 * @default 0.55
 * @range 0.10, 0.90
 */
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 uv = pixel / u_resolution;
  vec2 grid = floor(pixel / 18.0);
  vec2 cell = fract(pixel / 18.0);

  float cellSeed = hash(grid);
  float segmentSeed = hash(vec2(floor(grid.x / 7.0), grid.y));
  float rowSeed = hash(vec2(grid.y, 19.0));
  float pulse = 0.35 + 0.65 * (0.5 + 0.5 * sin(u_time * 0.55 + cellSeed * 6.2831));

  float block = step(0.91, cellSeed) * step(cell.x, 0.28) * step(cell.y, 0.28);
  float line = step(0.88, segmentSeed) * (1.0 - smoothstep(0.03, 0.10, cell.y));

  float runnerX = fract(u_time * 0.035 + rowSeed);
  float runner = step(0.90, rowSeed)
    * (1.0 - smoothstep(0.0, 0.012, abs(uv.x - runnerX)))
    * step(cell.y, 0.22);

  float edgeFade = smoothstep(0.0, 0.12, uv.x)
    * smoothstep(0.0, 0.10, uv.y)
    * smoothstep(0.0, 0.12, 1.0 - uv.x)
    * smoothstep(0.0, 0.10, 1.0 - uv.y);

  float alpha = (block * 0.50 * pulse + line * 0.22 + runner * 0.62)
    * u_intensity
    * edgeFade;
  vec3 color = mix(u_muted, u_accent, clamp(block * pulse + runner, 0.0, 1.0));

  gl_FragColor = vec4(color, alpha);
}
