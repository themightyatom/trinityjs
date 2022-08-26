import * as THREE from '/three/build/three.module.js';

class eventManager {

    constructor(target) {
        this.pointerTarget = target;
        this.downActions = [];
        this.upActions = [];
        this.moveActions = [];
        this.wheelActions = [];
        this.leaveActions = [];
        this.touchMoveActions = [];
        this.touchEndActions = [];
        this.touchStartActions = [];
        this.pointerIsDown = false;
        this.pointer = new THREE.Vector2();
        this.pointerTarget.addEventListener('pointerdown', this.pointerDown.bind(this), false);
        this.pointerTarget.addEventListener('pointerup', this.pointerUp.bind(this), false);
        this.pointerTarget.addEventListener('pointermove', this.pointerMove.bind(this), false);
        this.pointerTarget.addEventListener('pointerleave', this.pointerLeave.bind(this), false);
        this.pointerTarget.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.pointerTarget.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.pointerTarget.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        this.pointerTarget.addEventListener('wheel', this.wheel.bind(this), false);
        this.pointerEvt = {};
        this.pointerEvt.pointer = this.pointer;
    }

    addAction(action) {
        switch (action.type) {
            case "down":
                if(this.downActions.includes(action)) return;
                this.downActions.push(action);
                break;

            case "up":
                this.upActions.push(action);
                break;

            case "move":
                this.moveActions.push(action);
                break;
            case "leave":
                this.leaveActions.push(action);
                break;
            case "wheel":
                if(this.wheelActions.includes(action)) return;
                this.wheelActions.push(action);
                break;
            case "touchMove":
                this.touchMoveActions.push(action);
                break;
            case "touchStart":
                this.touchStartActions.push(action);
                break;
            case "touchEnd":
                this.touchEndActions.push(action);
                break;

            default:
                break;
        }

    }
    removeAction(action){
        switch (action.type) {
            case "down":
                this.removeSpecificAction(this.downActions,action);
                break;

            case "up":
                this.removeSpecificAction(this.upActions,action);
                break;

            case "move":
                this.removeSpecificAction(this.moveActions,action);
                break;
            case "leave":
                this.removeSpecificAction(this.leaveActions,action);
                break;
            case "wheel":
                this.removeSpecificAction(this.wheelActions,action);
                break;
            case "touchMove":
                this.removeSpecificAction(this.touchMoveActions,action);
                break;
            case "touchStart":
                this.removeSpecificAction(this.touchStartActions,action);
                break;
            case "touchEnd":
                this.removeSpecificAction(this.touchEndActions,action);
                break;

            default:
                break;
        }

    }
    removeSpecificAction(arr,action){
        for (var i = arr.length - 1; i > -1 ; i--) {
            if (arr[i].target == action.target && arr[i].func == action.func) {
                arr.splice(i, 1);
            }
        }

    }

    removeAllActions(target) {

        const actionArrays = [this.downActions, this.upActions, this.moveActions, this.leaveActions, this.touchStartActions, this.touchMoveActions, this.touchEndActions]
        for (var j = 0; j < actionArrays.length; j++) {
            let arr = actionArrays[j];
            for (var i = arr.length - 1; i > -1 ; i--) {
                if (arr[i].target == target) {
                    arr.splice(i, 1);
                }
            }
        }


    }
    removeWheelAction(target) {
        for (var i = this.wheelActions.length - 1; i > -1; i--) {
            if (this.wheelActions[i].target === target) {
                this.wheelActions.splice(i, 1);
            }
        }
    }

    pointerDown(evt) {
        evt.preventDefault();
        this.pointerTarget.setPointerCapture( evt.pointerId );
        this.calculatePointerPosition(evt);
        for (var i = 0; i < this.downActions.length; i++) {
            this.downActions[i].target[this.downActions[i].func](evt);
            if (this.downActions[i] && this.downActions[i].cursor !== undefined) {
                $(this.pointerTarget).css('cursor', this.downActions[i].cursor);
            }
        }
        this.pointerIsDown = true;
    }
    pointerUp(evt) {
        evt.preventDefault();
        this.pointerTarget.releasePointerCapture(event.pointerId);
        this.calculatePointerPosition(evt);
        for (var i = 0; i < this.upActions.length; i++) {
            this.upActions[i].target[this.upActions[i].func](evt);
        }
        $(this.pointerTarget).css('cursor', 'auto');
        this.pointerIsDown = false;
    }
    pointerLeave(evt) {
        evt.preventDefault();
        console.log("leave actions");
        for (var i = 0; i < this.leaveActions.length; i++) {
            this.leaveActions[i].target[this.leaveActions[i].func](evt);
        }

    }

    pointerMove(evt) {
        evt.preventDefault();
        this.calculatePointerPosition(evt);
        for (var i = 0; i < this.moveActions.length; i++) {
            this.moveActions[i].target[this.moveActions[i].func](this.pointerEvt);
        }
    }
    wheel(evt) {
        evt.preventDefault();
        for (var i = 0; i < this.wheelActions.length; i++) {
            this.wheelActions[i].target[this.wheelActions[i].func](evt);
        }
    }

    onTouchMove(evt) {
        evt.preventDefault();
        for (var i = 0; i < this.touchMoveActions.length; i++) {
            this.touchMoveActions[i].target[this.touchMoveActions[i].func](evt);
        }
    }
    onTouchStart(evt) {
        evt.preventDefault();
        for (var i = 0; i < this.touchStartActions.length; i++) {
            this.touchStartActions[i].target[this.touchStartActions[i].func](evt);
        }
    }
    onTouchEnd(evt) {
        evt.preventDefault();
        for (var i = 0; i < this.touchEndActions.length; i++) {
            this.touchEndActions[i].target[this.touchEndActions[i].func](evt);
        }
    }

    calculatePointerPosition(e) {

        /* midX = camera.position.x;
        // midY = camera.position.z;
         pointer3d.x = (e.clientX - (renderer.domElement.width / 2)) * pixelRatio + midX;
         pointer3d.y = (e.clientY - (renderer.domElement.height / 2)) * pixelRatio + midY;
         raycaster.ray.intersectPlane(_plane, _intersection);*/
        var w = $(this.pointerTarget).width();
        var h = $(this.pointerTarget).height();
        this.pointer.x = (e.clientX / w) * 2 - 1;
        this.pointer.y = - (e.clientY / h) * 2 + 1;

        this.pointerEvt.clientX = e.clientX;
        this.pointerEvt.clientY = e.clientY;
        this.pointerEvt.pointerType = e.pointerType;

    }


}

export default eventManager