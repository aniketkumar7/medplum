/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { ClientApplication } from './ClientApplication';
import { Meta } from './Meta';
import { ProjectMembership } from './ProjectMembership';
import { Reference } from './Reference';
import { User } from './User';

/**
 * OAuth login.
 */
export interface Login {

  /**
   * This is a Login resource
   */
  readonly resourceType: 'Login';

  /**
   * The logical id of the resource, as used in the URL for the resource.
   * Once assigned, this value never changes.
   */
  id?: string;

  /**
   * The metadata about the resource. This is content that is maintained by
   * the infrastructure. Changes to the content might not always be
   * associated with version changes to the resource.
   */
  meta?: Meta;

  /**
   * A reference to a set of rules that were followed when the resource was
   * constructed, and which must be understood when processing the content.
   * Often, this is a reference to an implementation guide that defines the
   * special rules along with other profiles etc.
   */
  implicitRules?: string;

  /**
   * The base language in which the resource is written.
   */
  language?: string;

  /**
   * The client requesting the code.
   */
  client?: Reference<ClientApplication>;

  /**
   * The user requesting the code.
   */
  user?: Reference<ClientApplication | User>;

  /**
   * Reference to the project membership which includes FHIR identity
   * (patient, practitioner, etc), access policy, and user configuration.
   */
  membership?: Reference<ProjectMembership>;

  /**
   * OAuth scope or scopes.
   */
  scope?: string;

  /**
   * The authentication method used to obtain the code (password or
   * google).
   */
  authMethod?: string;

  /**
   * Time when the End-User authentication occurred.
   */
  authTime?: string;

  /**
   * The cookie value that can be used for session management.
   */
  cookie?: string;

  /**
   * The authorization code generated by the authorization server.  The
   * authorization code MUST expire shortly after it is issued to mitigate
   * the risk of leaks.  A maximum authorization code lifetime of 10
   * minutes is RECOMMENDED.  The client MUST NOT use the authorization
   * code more than once.  If an authorization code is used more than once,
   * the authorization server MUST deny the request and SHOULD revoke (when
   * possible) all tokens previously issued based on that authorization
   * code.  The authorization code is bound to the client identifier and
   * redirection URI.
   */
  code?: string;

  /**
   * PKCE code challenge presented in the authorization request.
   */
  codeChallenge?: string;

  /**
   * OPTIONAL, defaults to &quot;plain&quot; if not present in the request.  Code
   * verifier transformation method is &quot;S256&quot; or &quot;plain&quot;.
   */
  codeChallengeMethod?: string;

  /**
   * Optional secure random string that can be used in an OAuth refresh
   * token.
   */
  refreshSecret?: string;

  /**
   * Optional cryptographically random string that your app adds to the
   * initial request and the authorization server includes inside the ID
   * Token, used to prevent token replay attacks.
   */
  nonce?: string;

  /**
   * Whether a token has been granted for this login.
   */
  granted?: boolean;

  /**
   * Whether this login has been revoked or invalidated.
   */
  revoked?: boolean;

  /**
   * Whether this login has system administrator privileges.
   */
  admin?: boolean;

  /**
   * The Internet Protocol (IP) address of the client or last proxy that
   * sent the request.
   */
  remoteAddress?: string;

  /**
   * The User-Agent request header as sent by the client.
   */
  userAgent?: string;
}
