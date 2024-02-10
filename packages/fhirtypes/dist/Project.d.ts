/*
 * Generated by @medplum/generator
 * Do not edit manually.
 */

import { AccessPolicy } from './AccessPolicy';
import { Identifier } from './Identifier';
import { Meta } from './Meta';
import { Reference } from './Reference';
import { User } from './User';

/**
 * Encapsulation of resources for a specific project or organization.
 */
export interface Project {

  /**
   * This is a Project resource
   */
  readonly resourceType: 'Project';

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
   * An identifier for this project.
   */
  identifier?: Identifier[];

  /**
   * A name associated with the Project.
   */
  name?: string;

  /**
   * A summary, characterization or explanation of the Project.
   */
  description?: string;

  /**
   * Whether this project is the super administrator project. A super
   * administrator is a user who has complete access to all resources in
   * all projects.
   */
  superAdmin?: boolean;

  /**
   * Whether this project uses strict FHIR validation.
   */
  strictMode?: boolean;

  /**
   * Whether this project uses referential integrity on write operations
   * such as 'create' and 'update'.
   */
  checkReferencesOnWrite?: boolean;

  /**
   * The user who owns the project.
   */
  owner?: Reference<User>;

  /**
   * A list of optional features that are enabled for the project.
   */
  features?: ('bots' | 'cron' | 'email' | 'google-auth-required' | 'graphql-introspection')[];

  /**
   * The default access policy for patients using open registration.
   */
  defaultPatientAccessPolicy?: Reference<AccessPolicy>;

  /**
   * Secure environment variable that can be used to store secrets for
   * bots.
   */
  secret?: ProjectSecret[];

  /**
   * Web application or web site that is associated with the project.
   */
  site?: ProjectSite[];

  /**
   * Linked Projects whose contents are made available to this one
   */
  link?: ProjectLink[];
}

/**
 * Linked Projects whose contents are made available to this one
 */
export interface ProjectLink {

  /**
   * A reference to the Project to be linked into this one
   */
  project: Reference<Project>;
}

/**
 * Secure environment variable that can be used to store secrets for
 * bots.
 */
export interface ProjectSecret {

  /**
   * The secret name.
   */
  name: string;

  /**
   * The secret value.
   */
  valueString?: string;

  /**
   * The secret value.
   */
  valueBoolean?: boolean;

  /**
   * The secret value.
   */
  valueDecimal?: number;

  /**
   * The secret value.
   */
  valueInteger?: number;
}

/**
 * Web application or web site that is associated with the project.
 */
export interface ProjectSite {

  /**
   * Friendly name that will make it easy for you to identify the site in
   * the future.
   */
  name: string;

  /**
   * The list of domain names associated with the site. User authentication
   * will be restricted to the domains you enter here, plus any subdomains.
   * In other words, a registration for example.com also registers
   * subdomain.example.com. A valid domain requires a host and must not
   * include any path, port, query or fragment.
   */
  domain: string[];

  /**
   * The publicly visible Google Client ID for the site. This is used to
   * authenticate users with Google. This value is available in the Google
   * Developer Console.
   */
  googleClientId?: string;

  /**
   * The private Google Client Secret for the site. This value is available
   * in the Google Developer Console.
   */
  googleClientSecret?: string;

  /**
   * The publicly visible reCAPTCHA site key. This value is generated when
   * you create a new reCAPTCHA site in the reCAPTCHA admin console. Use
   * this site key in the HTML code your site serves to users.
   */
  recaptchaSiteKey?: string;

  /**
   * The private reCAPTCHA secret key. This value is generated when you
   * create a new reCAPTCHA site in the reCAPTCHA admin console. Use this
   * secret key for communication between your site and reCAPTCHA.
   */
  recaptchaSecretKey?: string;
}
