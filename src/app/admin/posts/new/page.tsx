"use client";

import React from 'react';
import { createPost } from '../actions';
import PostForm from '../PostForm';

export default function NewPostPage() {
    return (
        <PostForm
            title="Yeni İçerik Ekle"
            onSubmit={createPost}
        />
    );
}
