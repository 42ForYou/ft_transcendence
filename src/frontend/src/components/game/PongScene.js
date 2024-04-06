import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useGame } from "../../context/GameContext";

// todo: 1. 닉네임, 패들에 색깔 부여 2. 마우스 움직이면 카메라 각도 조정
const PongScene = () => {
  const {
    tournamentConfig,
    ballTrajectory,
    paddleATrajectory,
    paddleBTrajectory,
    ballTrajectoryVersion,
    paddleATrajectoryVersion,
    paddleBTrajectoryVersion,
  } = useGame();
  const mountRef = useRef(null);
  const ballRef = useRef();
  const paddleARef = useRef();
  const paddleBRef = useRef();
  const [scene, setScene] = useState(null);
  const [root, setRoot] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const currentSegmentIndexRef = useRef(0);

  const updateBallPosition = (ballTrajectory) => {
    if (!ballTrajectory || ballTrajectory.segments.length === 0) return;

    const ball = ballRef.current;
    const currentSegmentIndex = currentSegmentIndexRef.current;
    if (currentSegmentIndex >= ballTrajectory.segments.length) return;
    const segment = ballTrajectory.segments[currentSegmentIndex];

    const currentTime = (Date.now() / 1000).toFixed(3);
    const eventElapsedTime = currentTime - ballTrajectory.t_event;
    const segmentElapsedTime = eventElapsedTime - segment.t_start;

    // 세그먼트 내에서의 위치 비율 계산
    let progress = segmentElapsedTime / segment.duration;

    if (progress > 1) {
      progress = 1;
      currentSegmentIndexRef.current = currentSegmentIndex + 1;
    }

    const newX = segment.x_s + (segment.x_e - segment.x_s) * progress;
    const newY = segment.y_s + (segment.y_e - segment.y_s) * progress;
    ball.position.set(newX, newY, ball.position.z);
  };

  /*
	newY = (현재 처리하는 데이터가 들어왔을 시점의 y좌표) + (흐른 시간 * 패들 속도)
	흐른 시간 = (현재 시간 - 현재 처리하는 데이터가 들어왔을 시점의 시간)
	*/
  const updatePaddlePosition = (paddleTrajectory, paddleRef) => {
    if (!paddleTrajectory || !paddleRef.current || !paddleTrajectory.t_start) return;

    const paddle = paddleRef.current;

    const currentTime = (Date.now() / 1000).toFixed(3);
    const elapsedTime = currentTime - paddleTrajectory.t_start;
    let newY = paddleTrajectory.y + paddleTrajectory.dy * elapsedTime;

    if (paddleTrajectory.dy > 0) {
      newY = Math.min(newY, tournamentConfig.y_max - tournamentConfig.len_paddle / 2);
    } else {
      newY = Math.max(newY, tournamentConfig.y_min + tournamentConfig.len_paddle / 2);
    }

    if (paddle.position.y !== newY) {
      paddle.position.set(paddle.position.x, newY, paddle.position.z);
    }
  };

  // 장면, 루트 그룹, 렌더러, 카메라 생성
  // todo: 카메라의 좌표를 필드의 크기에 따라 설정
  useEffect(() => {
    if (!tournamentConfig) return;

    // 장면 생성
    const newScene = new THREE.Scene();
    const newRoot = new THREE.Group();
    setScene(newScene);

    // 루트 그룹 생성
    setRoot(newRoot);
    newRoot.rotation.x = -Math.PI / 2; // z축이 위를, y축이 안쪽을 향하도록 회전
    newScene.add(newRoot);

    // 카메라 생성
    const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    newCamera.position.set(0, 0, 800);
    // newCamera.up.set(0, 0, 1); // 카메라의 업벡터를 z축으로 설정
    newCamera.lookAt(new THREE.Vector3(0, 0, 0));
    setCamera(newCamera);
    newRoot.add(newCamera);

    const newRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(newRenderer.domElement);
    setRenderer(newRenderer);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      newRenderer.setSize(width, height);
      newCamera.aspect = width / height;
      newCamera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize, false);

    return () => {
      window.removeEventListener("resize", onResize);
      // todo: 임시해결
      if (mountRef.current && mountRef.current.contains(newRenderer.domElement)) {
        mountRef.current.removeChild(newRenderer.domElement);
      }
    };
  }, [tournamentConfig]);

  // 라이트, 필드, 패들, 공 생성
  useEffect(() => {
    if (root && renderer && camera && tournamentConfig) {
      const { x_max, x_min, y_max, y_min, x_init_ball, y_init_ball, y_init_paddle, len_paddle } = tournamentConfig;

      // 프론트 임의 변수값
      const fieldMargin = 100; // 필드의 가장자리에 있는 여유 공간
      const paddleWidth = fieldMargin / 3; // 패들의 너비
      const ballRadius = 20; // 공의 반지름
      const wallHeight = 100; // 벽의 높이
      const wallDepth = 30; // 벽의 두께

      // 라이트
      const ambientLight = new THREE.AmbientLight(0x440088); // 약한 환경광
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 밝은 방향광
      const pointLight = new THREE.PointLight(0xffffff, 1); // 밝은 점광원
      pointLight.position.set(0, 0, 100);
      directionalLight.position.set(0, 0, 100);
      root.add(ambientLight);
      root.add(pointLight);
      root.add(directionalLight);

      // 필드
      // marginedField: 필드의 가장자리에 여유 공간을 둔 버전
      const fieldWidth = x_max - x_min;
      const fieldHeight = y_max - y_min;
      const fieldDepth = 100;
      const marginedFieldGeometry = new THREE.BoxGeometry(
        fieldWidth + (fieldMargin + paddleWidth) * 2,
        fieldHeight + ballRadius * 2,
        fieldDepth
      );
      const marginedFieldMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x072534,
        specular: 0x555555,
        shininess: 30,
      });
      const marginedField = new THREE.Mesh(marginedFieldGeometry, marginedFieldMaterial);
      marginedField.position.set(0, 0, -fieldDepth); // 필드의 바닥이 z=0이 되도록 설정
      root.add(marginedField);

      // 벽
      const wallGeometry = new THREE.BoxGeometry(fieldWidth + (fieldMargin + paddleWidth) * 2, wallDepth, wallHeight);
      const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x072534,
        specular: 0x555555,
        shininess: 30,
      });
      const wallTop = new THREE.Mesh(wallGeometry, wallMaterial);
      const wallBottom = new THREE.Mesh(wallGeometry, wallMaterial);
      wallTop.position.set(0, y_max + (ballRadius + wallDepth / 2), -wallHeight / 2);
      wallBottom.position.set(0, y_min - (ballRadius + wallDepth / 2), -wallHeight / 2);
      root.add(wallTop);
      root.add(wallBottom);

      // 점선
      const dashLineXPositionLeft = x_min;
      const dashLineXPositionRight = x_max;

      const startPointLeft = new THREE.Vector3(dashLineXPositionLeft, y_min, 0);
      const endPointLeft = new THREE.Vector3(dashLineXPositionLeft, y_max, 0);
      const startPointRight = new THREE.Vector3(dashLineXPositionRight, y_min, 0);
      const endPointRight = new THREE.Vector3(dashLineXPositionRight, y_max, 0);
      const startPointCenter = new THREE.Vector3(0, y_min, 0);
      const endPointCenter = new THREE.Vector3(0, y_max, 0);

      const dashLineGeometryLeft = new THREE.BufferGeometry().setFromPoints([startPointLeft, endPointLeft]);
      const dashLineGeometryRight = new THREE.BufferGeometry().setFromPoints([startPointRight, endPointRight]);
      const dashLineGeometryCenter = new THREE.BufferGeometry().setFromPoints([startPointCenter, endPointCenter]);

      const dashLineMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff, // 색상: 흰색
        linewidth: 3, // 선의 너비
        scale: 1, // 점선의 스케일
        dashSize: 5, // 점선의 대시 크기
        gapSize: 10, // 점선 사이의 간격
      });

      const dashLineLeft = new THREE.Line(dashLineGeometryLeft, dashLineMaterial);
      const dashLineRight = new THREE.Line(dashLineGeometryRight, dashLineMaterial);
      const dashLineCenter = new THREE.Line(dashLineGeometryCenter, dashLineMaterial);
      dashLineLeft.computeLineDistances();
      dashLineCenter.computeLineDistances();
      dashLineRight.computeLineDistances();
      // root.add(dashLineLeft);
      root.add(dashLineCenter);
      // root.add(dashLineRight);

      // 패들
      const paddleHeight = len_paddle;
      const paddleDepth = 20;
      const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
      const paddleMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x4f4f4f,
        specular: 0x66bdff,
        shininess: 30,
      });
      const paddleA = new THREE.Mesh(paddleGeometry, paddleMaterial);
      const paddleB = new THREE.Mesh(paddleGeometry, paddleMaterial);
      paddleA.position.set(x_min - paddleWidth / 2 - ballRadius, y_init_paddle, paddleDepth / 2);
      paddleB.position.set(x_max + paddleWidth / 2 + ballRadius, y_init_paddle, paddleDepth / 2);
      root.add(paddleA);
      root.add(paddleB);
      paddleARef.current = paddleA;
      paddleBRef.current = paddleB;

      // 공
      const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
      const ballMaterial = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0x4f4f4f,
        specular: 0x66bdff,
        shininess: 30,
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(x_init_ball, y_init_ball, ballRadius);
      root.add(ball);
      ballRef.current = ball;
    }
  }, [root, renderer, camera, tournamentConfig]);

  // 애니메이션
  useEffect(() => {
    // for test
    // if (scene && renderer && camera && ballRef.current && ballTrajectory.current) {
    if (scene && renderer && camera) {
      let animationId = null;
      const animate = () => {
        updateBallPosition(ballTrajectory.current);
        updatePaddlePosition(paddleATrajectory.current, paddleARef);
        updatePaddlePosition(paddleBTrajectory.current, paddleBRef);
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [ballTrajectoryVersion, paddleATrajectoryVersion, paddleBTrajectoryVersion, scene, renderer, camera]);

  useEffect(() => {
    currentSegmentIndexRef.current = 0;
  }, [ballTrajectoryVersion]);

  /*
	만약 지금 프레임이 이번에 들어온 데이터의 첫 프레임이고,
	오차값이 POS_MAX_ERROR를 넘으면 들어온 데이터의 y좌표값으로 패들의 y좌표값을 설정한다.
	그렇지 않으면(=오차값이 허용범위 이내라면) 현재 패들의 y좌표값을 그대로 사용한다.
	
	오차 = |현재 y좌표값 - 데이터의 y좌표값|
	(튕길 거면 한번에 튕기자)
	*/
  // 패들 A의 위치 오차값을 확인하고, 오차값이 network_max_deviation를 넘으면 패들의 위치를 수정한다.
  useEffect(() => {
    if (tournamentConfig && paddleARef && paddleARef.current && paddleATrajectory) {
      const paddle = paddleARef.current;
      const posErrorValue = Math.abs(paddle.position.y - paddleATrajectory.current.y);
      const maxErrorValue = tournamentConfig.network_max_deviation;
      if (posErrorValue <= maxErrorValue) {
        paddleATrajectory.y = paddle.position.y; // 에러가 허용 범위 내라면, 현 y좌표값을 그대로 사용
      }
    }
  }, [paddleATrajectoryVersion, tournamentConfig]);

  // 패들 B의 위치 오차값을 확인하고, 오차값이 network_max_deviation를 넘으면 패들의 위치를 수정한다.
  useEffect(() => {
    if (tournamentConfig && paddleBRef.current && paddleBTrajectory) {
      const paddle = paddleBRef.current;
      const posErrorValue = Math.abs(paddle.position.y - paddleBTrajectory.current.y);
      const maxErrorValue = tournamentConfig.network_max_deviation;
      if (posErrorValue <= maxErrorValue) {
        paddleBTrajectory.y = paddle.position.y; // 에러가 허용 범위 내라면, 현 y좌표값을 그대로 사용
      }
    }
  }, [paddleBTrajectoryVersion, tournamentConfig]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", overflow: "hidden" }} />;
};

export default PongScene;
