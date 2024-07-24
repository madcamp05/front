import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Shelf = ({ position, size, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Book = ({ position, size, color, onClick }) => {
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const createBooksForShelf = (yPosition, shelfWidth, shelfDepth, shelfHeight, spaceBetweenShelves, handleBookClick) => {
  const bookColors = ['#8B4513', '#A52A2A', '#DEB887', '#D2691E', '#F4A460'];
  const books = [];
  let xOffset = -shelfWidth / 2 + 0.2;
  const maxBookHeight = spaceBetweenShelves * 0.9;

  while (xOffset < shelfWidth / 2 - 0.2) {
    const bookWidth = Math.random() * 0.2 + 0.1;
    const bookHeight = Math.random() * maxBookHeight + 0.1;
    const bookDepth = shelfDepth * 0.9;
    const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];

    books.push(
      <Book
        key={`${yPosition}-${xOffset}`}
        position={[xOffset, yPosition + (bookHeight / 2), 0]}
        size={[bookWidth, bookHeight, bookDepth]}
        color={bookColor}
        onClick={() => handleBookClick({ position: [0, 0, 1], size: [2.25, 4, 1], color: bookColor })}
      />
    );

    xOffset += bookWidth + 0.05;
  }

  return books;
};

const Bookshelf = ({ handleBookClick }) => {
  const shelfWidth = 3;
  const shelfHeight = 0.1;
  const shelfDepth = 0.5;
  const numShelves = 8;
  const spaceBetweenShelves = 1;

  const shelves = [];
  const books = [];
  for (let i = 0; i < numShelves; i++) {
    const yPosition = i * (shelfHeight + spaceBetweenShelves) - (numShelves * (shelfHeight + spaceBetweenShelves)) / 2;
    shelves.push(
      <Shelf
        key={`shelf-${i}`}
        position={[0, yPosition, 0]}
        size={[shelfWidth, shelfHeight, shelfDepth]}
        color={'#d3d3d3'}
      />
    );
    books.push(...createBooksForShelf(yPosition, shelfWidth, shelfDepth, shelfHeight, spaceBetweenShelves, handleBookClick));
  }

  // Create back panel
  const backPanelHeight = numShelves * (shelfHeight + spaceBetweenShelves) + spaceBetweenShelves;
  const backPanel = (
    <mesh position={[0, 0, -shelfDepth / 2 - 0.01]}>
      <planeGeometry args={[shelfWidth, backPanelHeight]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );

  return (
    <group>
      {backPanel}
      {shelves}
      {books}
      {/* Add sides of the bookshelf */}
      <Shelf position={[shelfWidth / 2, 0, 0]} size={[shelfHeight, backPanelHeight, shelfDepth]} color={'#d3d3d3'} />
      <Shelf position={[-shelfWidth / 2, 0, 0]} size={[shelfHeight, backPanelHeight, shelfDepth]} color={'#d3d3d3'} />
    </group>
  );
};

const createTextTexture = (text) => {
    if (!text) {
        text = ''; // Ensure text is at least an empty string if undefined or null
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = '48px Arial';
    context.textBaseline = 'top';

    const maxCharsPerLine = 10;
    const lineHeight = 60;
    const x = 50;
    let y = 100;

    const lines = [];
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
        lines.push(text.slice(i, i + maxCharsPerLine));
    }

    lines.forEach(line => {
        context.fillText(line, x, y);
        y += lineHeight;
    });

    return new THREE.CanvasTexture(canvas);
};

const BookDetail = ({ position, size, color }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 9; // Number of pages in the book

    const handlePageTurn = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % (totalPages + 1));
    };

    const pageContents = useMemo(() => [
        '여름날의 소매치기',
        '몰입캠프 2분반의 실세는 햄스터 유경. 쥑쥑',
        '햄스터의 최애 음식은 해바라기씨가 아니라 시즈닝 닭덮밥이다. 쥑쥑!',
        '야무지게 먹어야지~',
        '오늘은 그날따라 지갑을 안 가져와서 점심을 걸러야 했답니다 오노~',
        '하지만 수준급의 소매치기 실력으로 지나가던 승주의 지갑을 훔쳐 달아난 유경!',
        '그런데 뒤를 돌아보니 승주가 무서운 속도의 옆돌기로 쫓아오고 있다',
        '여름이었다.',
        'The end',
    ], []);

    return (
        <group position={position}>
            {/* Book cover */}
            <mesh
                position={[0, 0, size[2] / 2]}
                rotation={[0, currentPage === 0 ? 0 : -Math.PI / 2, 0]}
            >
                <planeGeometry args={[size[0], size[1]]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Pages */}
            {Array.from({ length: totalPages }).map((_, index) => (
                <mesh
                    key={index}
                    position={[0, 0, (size[2] / 2) - 0.02 * (index + 1)]}
                    rotation={[0, index + 1 < currentPage ? -Math.PI / 2 : 0, 0]}
                >
                    <planeGeometry args={[size[0], size[1]]} />
                    <meshStandardMaterial map={createTextTexture(pageContents[index] || '')} />
                </mesh>
            ))}
            {/* Click area for turning pages */}
            <mesh
                position={[size[0] / 2 + 0.1, 0, size[2] / 2]}
                onClick={handlePageTurn}
                visible={false}
            >
                <boxGeometry args={[0.2, size[1], size[2]]} />
            </mesh>
        </group>
    );
};


const BookshelfScene = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Bookshelf handleBookClick={handleBookClick} />
      {selectedBook && (
        <BookDetail position={selectedBook.position} size={selectedBook.size} color={selectedBook.color} />
      )}
      <OrbitControls />
    </Canvas>
  );
};

export default BookshelfScene;
