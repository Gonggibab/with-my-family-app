import AddPostBox from 'components/AddPost/addPostBox';

import styles from 'styles/views/AddPost.module.scss';

export default function AddPost() {
  return (
    <div className={styles.container}>
      <AddPostBox />
    </div>
  );
}
