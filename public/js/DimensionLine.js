
import * as THREE from '/three/build/three.module.js';
import { Object3D } from '/three/build/three.module.js';
class DimensionLine extends Object3D {
	constructor(start, end, color = 0x000000, headwidth = 0.05, headlength = 0.1, offset = 0 ) {
		super();
		this.start = start;
		this.headWidth = headwidth;
		this.headLength = headlength;
		this.end = end;
		this.color = color;
		
		this.arrow;
		this.label;
		this.labelHolder;
		this.zeroQuat = new THREE.Quaternion;
		this.drawLabel = false;
		this.offset = offset;
		this.draw();

	}
	draw() {
		var direction = this.end.clone().sub(this.start);
		var length = direction.length();
		this.arrow = new ArrowHelper2(direction.normalize(), this.start, length, this.color, this.headLength, this.headWidth);
		this.add(this.arrow);
		if(this.drawLabel){
			this.labelHolder = new Object3D();
			this.labelHolder.rotateX(-Math.PI/2);
			this.add(this.labelHolder);
			this.label = new Text2D(length + " cm", 20, "#000000");
			this.labelHolder.position.x = this.start.x + ((this.end.x - this.start.x)/2);
			this.labelHolder.position.z = this.start.z + ((this.end.z - this.start.z)/2);
			this.labelHolder.position.y = 0.01;
			//this.label.rotateX(-Math.PI/2);
			this.labelHolder.add(this.label);
		}
		if(this.offset != 0){
			this.position.x += this.offset * direction.z;
			this.position.z -= this.offset * direction.x;
			//left hand construction line
			let leftstart = new THREE.Vector3(this.start.x - this.position.x, this.start.y, this.start.z -this.position.z );
			let leftdirection = new THREE.Vector3(direction.z,direction.y,-direction.x);
			let left = new ArrowHelper2(leftdirection.normalize(), leftstart, this.offset + 0.2, this.color, this.headLength, this.headWidth,false);
			this.add(left);

			let rightstart = new THREE.Vector3(this.end.x - this.position.x, this.end.y, this.end.z -this.position.z );
			//let leftdirection = new THREE.Vector3(direction.z,direction.y,-direction.x);
			let right = new ArrowHelper2(leftdirection.normalize(), rightstart, this.offset + 0.2, this.color, this.headLength, this.headWidth,false);
			this.add(right);
		}
	}
	redraw(start, end, zaxis = false) {
		var direction = end.clone().sub(start);
		var length = direction.length();
		var normalized = direction.normalize()
		this.arrow.setDirection(normalized);
		this.arrow.setLength(length, this.headLength, this.headWidth);
		this.arrow.position.copy(start);
		if(this.drawLabel){
			this.label.redraw(Math.round(length * 100) + "cm");
			this.labelHolder.position.x = start.x + ((end.x - start.x)/2);
			this.labelHolder.position.z = start.z + ((end.z - start.z)/2);
			if(normalized.y == -1){
			this.labelHolder.position.y = (start.y/2);
			}else{
			this.labelHolder.position.y = (start.y + 0.1);	
			}
			if(zaxis){
				this.labelHolder.position.x += (this.label.textWidth/200);
			}else{
				this.labelHolder.position.z -= (this.label.textHeight/200);
			}
		}
	}
	
	scaleText(val){
		if(this.drawLabel) this.label.mesh.scale.set(val,val/4,1);
	}
}
export default DimensionLine;

class Text2D extends Object3D {
	constructor(str, size, color) {
		super();
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.fontSize = size;
		this.textStr = str;
		this.color = color;
		this.context.font = size + "px Arial";
		this.mesh;
		this.textWidth = 40;
		this.textHeight = 10;
		
		return this.draw();
	}

	draw() {
		let metrics = this.context.measureText(this.textStr);

		//let textWidth = this.roundUp(metrics.width + 20.0, 2);
		//let textHeight = this.roundUp(this.fontSize + 10.0, 2);

		this.canvas.width = this.textWidth * 4;
		this.canvas.height = this.textHeight * 4;

		this.context.font = "bold " +  this.textHeight*2 + "px Arial";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.fillStyle = this.color;
		this.context.fillText(this.textStr, this.textWidth, this.textHeight);

		let texture = new THREE.Texture(this.canvas);
		texture.needsUpdate = true;

		let material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
			depthTest:false
		});

		let spriteMat = new THREE.SpriteMaterial({
			map:texture,
			depthTest:false
		});




		//this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(textWidth / 60, textHeight / 60, 1, 1), material);
		//this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.textWidth / 50, this.textHeight / 50, 1, 1), material);
		this.mesh = new THREE.Sprite(spriteMat);
		this.mesh.scale.set(1,1,1);
		this.add(this.mesh);


		return this;

	}
	redraw(str){
		this.textStr = str;
		let metrics = this.context.measureText(this.textStr);

		//let textWidth = this.roundUp(metrics.width + 20.0, 2);
		//let textHeight = this.roundUp(this.fontSize + 10.0, 2);

		//this.canvas.width = textWidth;
		//this.canvas.height = textHeight;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.font = "bold " +  this.textHeight*2 + "px Arial";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		this.context.fillStyle = this.color;
		this.context.fillText(this.textStr, this.textWidth * 2, this.textHeight * 2);

		let texture = new THREE.Texture(this.canvas);
		texture.needsUpdate = true;

		this.mesh.material.map = texture;

	}

	roundUp(numToRound, multiple) {
		let value = multiple;
		while (value < numToRound) {
			value = value * multiple;
		}
		return value;
	}
}




class ArrowHelper2 extends Object3D {

	constructor(dir, origin, length, color, headLength, headWidth, arrows) {

		super();
		// dir is assumed to be normalized

		this.type = 'ArrowHelper';

		this._axis = new THREE.Vector3();
		let _lineGeometry, _coneGeometry;

		if (dir === undefined) dir = new Vector3(0, 0, 1);
		if (origin === undefined) origin = new Vector3(0, 0, 0);
		if (length === undefined) length = 1;
		if (color === undefined) color = 0xffff00;
		if (headLength === undefined) headLength = 0.2 * length;
		if (headWidth === undefined) headWidth = 0.2 * headLength;
		if (arrows === undefined) arrows = true;

		this.includeArrows = arrows;

		if (_lineGeometry === undefined) {

			_lineGeometry = new THREE.BufferGeometry();
			_lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

			if(this.includeArrows){
			_coneGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 5, 1);
			_coneGeometry.translate(0, - 0.5, 0);
			}

		}

		this.position.copy(origin);

		this.line = new THREE.Line(_lineGeometry, new THREE.LineBasicMaterial({ color: color, toneMapped: false, depthFunc:THREE.NeverDepth }));
		this.line.matrixAutoUpdate = false;
		this.add(this.line);

		if(this.includeArrows){
			this.cone = new THREE.Mesh(_coneGeometry, new THREE.MeshBasicMaterial({ color: color, toneMapped: false, depthFunc:THREE.NeverDepth  }));
			this.cone.matrixAutoUpdate = false;
			this.add(this.cone);

			this.cone2 = new THREE.Mesh(_coneGeometry, new THREE.MeshBasicMaterial({ color: color, toneMapped: false, depthFunc:THREE.NeverDepth  }));
			this.cone2.matrixAutoUpdate = false;
			this.cone2.rotateX(Math.PI);
			this.add(this.cone2);
		}

		this.setDirection(dir);
		this.setLength(length, headLength, headWidth);

	}

	setDirection(dir) {

		// dir is assumed to be normalized

		if (dir.y > 0.99999) {

			this.quaternion.set(0, 0, 0, 1);

		} else if (dir.y < - 0.99999) {

			this.quaternion.set(1, 0, 0, 0);

		} else {

			// this.set( dir.z, 0, - dir.x ).normalize();
			let q = new THREE.Vector3(dir.z, 0, - dir.x).normalize();


			const radians = Math.acos(dir.y);

			this.quaternion.setFromAxisAngle(q, radians);

		}

	}

	setLength(length, headLength, headWidth) {

		if (headLength === undefined) headLength = 0.2 * length;
		if (headWidth === undefined) headWidth = 0.2 * headLength;

		this.line.scale.set(1, Math.max(0.0001, length - headLength), 1); // see #17458
		this.line.updateMatrix();
		if(this.includeArrows){
			this.cone.scale.set(headWidth, headLength, headWidth);
			this.cone.position.y = length;
			this.cone.updateMatrix();

			this.cone2.scale.set(headWidth, headLength, headWidth);
			this.cone2.updateMatrix();
		}

	}

	setColor(color) {

		this.line.material.color.set(color);
		this.cone.material.color.set(color);

	}

	copy(source) {

		super.copy(source, false);

		this.line.copy(source.line);
		this.cone.copy(source.cone);

		return this;

	}

}