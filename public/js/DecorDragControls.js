import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3,
	Euler
} from '/three/build/three.module.js';

var DecorDragControls = function (target, camera, _domElement, dragCallback = null, wheelCallback = null) {

	var _plane = new Plane(new Vector3(0, 1, 0), 0); // y plane
	var _raycaster = new Raycaster();
	_raycaster.params.Line.threshold = 0.0;
    _raycaster.params.Points.threshold = 0.0;
    _raycaster.params.Mesh.threshold = 0.0;
	var _target = target;

	var dragCB = dragCallback;
	var wheelCB = wheelCallback;

	var _mouse = new Vector2();
	var _offset = new Vector3();
	var _intersection = new Vector3();
	var _worldPosition = new Vector3();
	var _inverseMatrix = new Matrix4();
	var _intersections = [];
	var _pos1 = new Vector2();
	var _pos2 = new Vector2();
	var _startRot = 0;
	var _startTouchRot = 0;

	var _selected = null, _hovered = null;
	var rotationEnabled = true;
	var _lastEvent;
	var _camera = camera;
	var _rect = _domElement.getBoundingClientRect();



	//

	var scope = this;

	function activate() {
		deactivate(); 
		//_domElement.addEventListener('pointermove', onPointerMove, false);
		DD2022.eventManager.addAction({type:"move", target:scope, func:"onPointerMove"});
		//_domElement.addEventListener('pointerdown', onPointerDown, false);
		DD2022.eventManager.addAction({type:"down", target:scope, func:"onPointerDown",cursor:'move'});
		//_domElement.addEventListener('pointerup', onPointerCancel, false);
		DD2022.eventManager.addAction({type:"up", target:scope, func:"onPointerCancel"});
		//_domElement.addEventListener('pointerleave', onPointerCancel, false);
		DD2022.eventManager.addAction({type:"leave", target:scope, func:"onPointerCancel"});
		//_domElement.addEventListener('touchmove', onTouchMove, false);
		DD2022.eventManager.addAction({type:"touchMove", target:scope, func:"onTouchMove"});
		//_domElement.addEventListener('touchstart', onTouchStart, false);
		DD2022.eventManager.addAction({type:"touchStart", target:scope, func:"onTouchStart"});
		//_domElement.addEventListener('touchend', onTouchEnd, false);
		DD2022.eventManager.addAction({type:"touchEnd", target:scope, func:"onTouchEnd"});
		//_domElement.addEventListener('wheel', onMouseWheel,false);
		DD2022.eventManager.addAction({type:"wheel", target:scope, func:"onMouseWheel"});

	}

	function deactivate() {

		DD2022.eventManager.removeAllActions(this);
		DD2022.eventManager.removeWheelAction(this);

		/*_domElement.removeEventListener('pointermove', onPointerMove, false);
		_domElement.removeEventListener('pointerdown', onPointerDown, false);
		_domElement.removeEventListener('pointerup', onPointerCancel, false);
		_domElement.removeEventListener('pointerleave', onPointerCancel, false);
		_domElement.removeEventListener('touchmove', onTouchMove, false);
		_domElement.removeEventListener('touchstart', onTouchStart, false);
		_domElement.removeEventListener('touchend', onTouchEnd, false);
		_domElement.removeEventListener('wheel', onMouseWheel,false);*/

		target = null;

		_domElement.style.cursor = '';

	}
	function setPlane(plane){
		_plane = plane;
	}
	function resetPlane(){
		_plane = new Plane(new Vector3(0, 1, 0), 0); // y plane
	}

	function dispose() {

		deactivate();

	}

	function setTarget(target) {
		_target = target;
		_rect = _domElement.getBoundingClientRect();
	}
	function setCamera(camera) {
		_camera = camera;
	}

	function getObjects() {

		return _objects;

	}


	function onPointerMove(event) {

	

		switch (event.pointerType) {

			case 'mouse':
			case 'pen':
				onMouseMove(event);
				break;

			// TODO touch

		}

	}

	function onMouseMove(event) {
		_lastEvent = event;
		

		_mouse.x = ((event.clientX - _rect.left) / _rect.width) * 2 - 1;
		_mouse.y = - ((event.clientY - _rect.top) / _rect.height) * 2 + 1;

		_raycaster.setFromCamera(_mouse, _camera);

		if (_selected && scope.enabled) {

			if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

				_selected.position.copy(_intersection.sub(_offset).applyMatrix4(_inverseMatrix));

			}

			//scope.dispatchEvent({ type: 'drag', object: _selected });
			if(dragCB) dragCB({object:_selected});
			// keep above ground plane
			_selected.position.y = Math.max(_selected.position.y,0);
           
			return;

		}

		_intersections.length = 0;

		_raycaster.setFromCamera(_mouse, _camera);
		_raycaster.intersectObjects(_target.children, true, _intersections);

		if (_intersections.length > 0) {

			var object = _intersections[0].object;

			//_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

			if (_hovered !== object) {

				scope.dispatchEvent({ type: 'hoveron', object: object });

				_domElement.style.cursor = 'pointer';
				_hovered = object;

			}

		} else {

			if (_hovered !== null) {

				scope.dispatchEvent({ type: 'hoveroff', object: _hovered });

				_domElement.style.cursor = 'auto';
				_hovered = null;

			}

		}
		
	

	}



	function onPointerDown(event) {

	

		switch (event.pointerType) {

			case 'mouse':
			case 'pen':
				onMouseDown(event);
				break;

			// TODO touch

		}

	}

	function onMouseDown(event) {


		_intersections.length = 0;

		_raycaster.setFromCamera(_mouse, _camera);
		_raycaster.intersectObjects(_target.children, true, _intersections);

		if (_intersections.length > 0) {

			//_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;
			_selected = _target;

			if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

				_inverseMatrix.copy(_selected.parent.matrixWorld).invert();
				_offset.copy(_intersection).sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld));

			}

			scope.dispatchEvent({ type: 'dragstart', object: _selected });

		}


	}

	function onPointerCancel(event) {

		

		switch (event.pointerType) {

			case 'mouse':
			case 'pen':
				onMouseCancel(event);
				break;

			// TODO touch

		}

	}

	function onMouseCancel(event) {

	

		if (_selected) {

			scope.dispatchEvent({ type: 'dragend', object: _selected });

			_selected = null;

		}

		_domElement.style.cursor = _hovered ? 'pointer' : 'auto';

	}

	function onTouchMove(event) {

		event.preventDefault();
		//dragging
		_lastEvent = {clientX:event.touches[0].clientX, clientY:event.touches[0].clientY};
		if (event.touches.length == 1) {
			event = event.changedTouches[0];

			var rect = _domElement.getBoundingClientRect();

			_mouse.x = ((event.clientX - _rect.left) / _rect.width) * 2 - 1;
			_mouse.y = - ((event.clientY - _rect.top) / _rect.height) * 2 + 1;

			_raycaster.setFromCamera(_mouse, _camera);

			if (_selected && scope.enabled) {

				if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

					_selected.position.copy(_intersection.sub(_offset).applyMatrix4(_inverseMatrix));

				}

				//scope.dispatchEvent({ type: 'drag', object: _selected });
				if(dragCB) dragCB({object:_selected});

				// keep above ground plane
				_selected.position.y = Math.max(_selected.position.y,0);
                render();
				return;

			}
		}else{
			if(!rotationEnabled) return;
			//rotating
			_pos1.x = event.touches[0].clientX;
			_pos1.y = event.touches[0].clientY;
			_pos2.x = event.touches[1].clientX;
			_pos2.y = event.touches[1].clientY;
			var rot = radianFrom2Points(_pos1,_pos2) - _startTouchRot;
			var objRot = _startRot - rot;
			
			_target.setRotationFromEuler(new Euler( 0, objRot, 0, 'XYZ' ));

		}
		
        render();
	}
	function radianFrom2Points(p1, p2){ // a pair of 3D points
        // move the vector to 0,0
        // working in the XZ plane, so ignore Y
        var vectorX = p2.x-p1.x;
        var vectorY = p2.y - p1.y; 

        var tangent = vectorY / vectorX;

        var angle = Math.atan(tangent);
        // convert to 0-180
        // first quadrant, no adjustment
		
        //second quadrant
        if(vectorX < 0 && vectorY >= 0){
            angle = (Math.PI) + angle; //angle between 90 and 180

        }
        //third quadrant
        if(vectorX < 0 && vectorY < 0){
            angle = (Math.PI) + angle; //angle between 180 and 270 (pi x 1.5)
        }
         //forth quadrant
         if(vectorX >= 0 && vectorY < 0){
            angle = (Math.PI*2) + angle; //angle between 270 and 360 . Plussing a minus value
        }

		
        return angle;

    }

	function onMouseWheel(event){
		
		if(!rotationEnabled) return;

		let amount = 0.0872665;
		if(event.deltaY < 0){
			amount = -amount;
		}
		_target.rotateY(amount);
		console.log(_target.getTrueRotation());
		//scope.dispatchEvent({ type: 'wheel', object: _selected });
		if(wheelCB)wheelCB(_selected);
		
        render();
	}

	function setRotationEnabled(val){
		rotationEnabled = val;
	}

	function onTouchStart(event) {

		event.preventDefault();
		// dragging 
		if (event.touches.length == 1) {


			event = event.changedTouches[0];

			_rect = _domElement.getBoundingClientRect();

			_mouse.x = ((event.clientX - _rect.left) / _rect.width) * 2 - 1;
			_mouse.y = - ((event.clientY - _rect.top) / _rect.height) * 2 + 1;

			_intersections.length = 0;

			_raycaster.setFromCamera(_mouse, _camera);
			_raycaster.intersectObjects(_target.children, true, _intersections);

			if (_intersections.length > 0) {

				//_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;
				_selected = _target;

				//_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

				if (_raycaster.ray.intersectPlane(_plane, _intersection)) {

					_inverseMatrix.copy(_selected.parent.matrixWorld).invert();
					_offset.copy(_intersection).sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld));

				}

			

				scope.dispatchEvent({ type: 'dragstart', object: _selected });

			}
		} else {
			//rotating
			//alert("rotating");
			_startRot = _target.rotation.y;
			
			_pos1.x = event.touches[0].clientX;
			_pos1.y = event.touches[0].clientY;
			_pos2.x = event.touches[1].clientX;
			_pos2.y = event.touches[1].clientY;
			_startTouchRot = radianFrom2Points(_pos1,_pos2);
			
		}


	}

	function onTouchEnd(event) {

	

		if (_selected) {

			scope.dispatchEvent({ type: 'dragend', object: _selected });

			_selected = null;

		}

		_domElement.style.cursor = 'auto';

	}

	function getLastEvent(){
		return _lastEvent;
	}
	function resetOffset(){
		_offset.x = _offset.y = _offset.z = 0;
	}

	activate();

	// API

	this.enabled = true;
	this.transformGroup = false;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
	this.getObjects = getObjects;
	this.setTarget = setTarget;
	this.setPlane = setPlane;
	this.resetPlane = resetPlane;
	this.rotationEnabled = setRotationEnabled;
	this.getLastEvent = getLastEvent;
	this.resetOffset = resetOffset;
	this.setCamera = setCamera;
	this.onPointerDown = onPointerDown;
	this.onPointerMove = onPointerMove;
	this.onPointerCancel = onPointerCancel;
	this.onTouchStart = onTouchStart;
	this.onTouchEnd = onTouchEnd;
	this.onTouchMove = onTouchMove;
	this.onMouseWheel = onMouseWheel;

};

DecorDragControls.prototype = Object.create(EventDispatcher.prototype);
DecorDragControls.prototype.constructor = DecorDragControls;

export { DecorDragControls };
