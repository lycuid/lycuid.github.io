import React, { useCallback } from 'react';
import ReactMarkdown, { PluggableList } from 'react-markdown';
import gfm from 'remark-gfm';
import StyledRepositories, { StyledRepositoryFile } from './repositories.style';
import { getSVGIcon, sanitizeRepoData } from './repositories.utils';

import File from '../__pure__/File/file.component';
import { useNavigate } from '../__pure__/Window/window.utils';
import { Anchor } from '../../Styles/global.style';
import { useStaticQuery, graphql } from 'gatsby';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowAltCircleLeft,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faFileCode } from '@fortawesome/free-regular-svg-icons';

interface RepositoriesProps extends React.HTMLAttributes<HTMLElement> {
  windowId: string;
}

const RepositoryFile: React.FC<RepositoriesProps & GithubRepository> = ({
  windowId,
  ...props
}) => {
  const navigate = useNavigate(windowId);

  const handleClick = useCallback(() => {
    navigate({
      name: 'Repositories',
      fileType: 'dir',
      children: <Repositories windowId={windowId} />,
    });
  }, [navigate, windowId]);

  return (
    <>
      <StyledRepositoryFile>
        <header>
          <FontAwesomeIcon
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={handleClick}
            icon={faArrowAltCircleLeft}
          />
          <small>
            <Anchor href={props.url}>
              view on github&nbsp;&nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Anchor>
          </small>
        </header>
        <hr />
        {props.description}
        <br />
        <dl>
          <dt>Languages used:</dt>
          <dd>
            {props.languages.length ? (
              props.languages.map((lang, i) => (
                <kbd key={`${lang}-${i}`}>{lang}</kbd>
              ))
            ) : (
              <small>--unknown--</small>
            )}
          </dd>
        </dl>
        <dl>
          <dt>Description:</dt>
          <dd>
            {props.README_MD?.text ? (
              <ReactMarkdown remarkPlugins={[gfm] as PluggableList}>
                {props.README_MD?.text}
              </ReactMarkdown>
            ) : (
              <pre>{props.README?.text}</pre>
            )}
          </dd>
        </dl>
      </StyledRepositoryFile>
    </>
  );
};

const Repositories: React.FC<RepositoriesProps> = ({ windowId, ...props }) => {
  const repos = sanitizeRepoData(useStaticQuery(query));
  const navigate = useNavigate(windowId);

  const handleOpen = useCallback(
    (repo) => {
      return () =>
        navigate({
          name: repo.name,
          fileType: 'file',
          children: <RepositoryFile windowId={windowId} {...repo} />,
        });
    },
    [navigate, windowId]
  );

  return (
    <>
      <StyledRepositories {...props}>
        {repos.map((repo: GithubRepository) => {
          const props = repo.languages.length
            ? { Svg: getSVGIcon(repo.languages[0]) }
            : { faIcon: faFileCode };

          return (
            <File
              {...props}
              key={repo.id}
              title={repo.description}
              name={repo.name}
              onDoubleClick={handleOpen(repo)}
              onKeyPress={(e) =>
                e.key.toLowerCase() === 'enter' && handleOpen(repo)()
              }
            />
          );
        })}
      </StyledRepositories>
    </>
  );
};

const query = graphql`
  query {
    github {
      user(login: "lycuid") {
        repositories(first: 100) {
          nodes {
            id
            name
            url
            description
            languages(first: 50, orderBy: { field: SIZE, direction: DESC }) {
              nodes {
                name
              }
            }
            README_MD: object(expression: "HEAD:README.md") {
              ... on Github_Blob {
                text
              }
            }
            README: object(expression: "HEAD:README") {
              ... on Github_Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;

export default Repositories;
