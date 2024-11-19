const vertexShader : string = `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normal;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;
const fragmentShader :string = `
          uniform float time;
          uniform vec3 color;
          varying vec3 vPosition;

          float cosineSquared(float x) {
              return (1.0 - x * x) * (1.0 - x * x);
          }

          void main() {
            float stripPosition = time;
            float intensity = cosineSquared(clamp(1.5 * abs(vPosition.x + vPosition.z - stripPosition) + 0.5*abs(vPosition.y - 0.4), 0.0, 1.0));
  
            vec3 highlight = vec3(0.8) * intensity; // White strip
            gl_FragColor = vec4(color + highlight, 1.0);
          }
        `;
export {vertexShader, fragmentShader};