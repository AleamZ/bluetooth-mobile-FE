import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogService } from '../../services/blog.service';
import '../../styles/Scss-Component/blog.scss';
import { FaCalendar } from 'react-icons/fa';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (id) {
        try {
          const data = await BlogService.getBlogById(id);
          setBlog(data);
        } catch (error) {
          console.error('Error fetching blog:', error);
        }
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">{blog.title}</h1>
        <div className="blog-metadata">
          <span className="date">
            <FaCalendar />
            {formatDate(blog.createdAt)}
          </span>
        </div>
        <div className="blog-tags">
          {blog.tags.map((tag: string, index: number) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogView;
