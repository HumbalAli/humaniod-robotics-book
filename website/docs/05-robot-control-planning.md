---
sidebar_position: 5
---

# 5. Robot Control & Planning

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {Callout} from '@site/src/components/Callout';

## 5.1 Introduction to Robot Control

Robot control is the process of commanding a robot to perform desired tasks by manipulating its actuators to achieve specific motions or forces. Control systems bridge the gap between high-level planning and low-level actuator commands, ensuring the robot moves precisely and safely according to its objectives.

<Callout type="info">
**Key Insight:** Robot control systems must balance precision, stability, and responsiveness while accounting for system dynamics, disturbances, and safety constraints to achieve reliable robot operation.
</Callout>

### 5.1.1 Control System Hierarchy

Robot control typically operates at multiple levels:

- **Trajectory Planning**: Generate desired paths and motions
- **Feedforward Control**: Anticipate system behavior based on models
- **Feedback Control**: Correct errors using sensor measurements
- **Adaptive Control**: Adjust parameters based on changing conditions

### 5.1.2 Control System Requirements

<Tabs>
<TabItem value="stability" label="Stability" default>
- System must remain stable under all operating conditions
- Bounded response to bounded inputs
- Convergence to desired states
</TabItem>
<TabItem value="performance" label="Performance">
- Fast response to commands
- Minimal tracking error
- Smooth motion profiles
</TabItem>
<TabItem value="robustness" label="Robustness">
- Insensitive to model uncertainties
- Tolerant to disturbances
- Reliable operation across conditions
</TabItem>
</Tabs>

## 5.2 Classical Control Techniques

### 5.2.1 Proportional-Integral-Derivative (PID) Control

PID controllers are fundamental to robot control, providing a simple yet effective approach to feedback control:

<div className="feature-card">

#### 🎛️ **PID Components**
- **Proportional (P)**: Corrects present error
- **Integral (I)**: Eliminates steady-state error
- **Derivative (D)**: Predicts future error and dampens response

</div>

<div className="feature-card">

#### 📈 **PID Implementation**
- **Tuning**: Adjust gains (Kp, Ki, Kd) for desired response
- **Derivative Kick**: Use filtered derivative to avoid noise amplification
- **Windup Prevention**: Limit integral action to prevent saturation

</div>

#### PID Controller Implementation
```python
class PIDController:
    def __init__(self, kp, ki, kd, output_limits=(-1, 1)):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.output_limits = output_limits  # Output limits

        # Internal variables
        self.last_error = 0
        self.integral = 0
        self.last_time = None

    def update(self, error, dt=None):
        """Update PID controller with current error"""
        import time

        # Calculate time step if not provided
        current_time = time.time()
        if dt is None:
            if self.last_time is None:
                dt = 0.01  # Default time step
            else:
                dt = current_time - self.last_time
        self.last_time = current_time

        if dt <= 0:
            return 0

        # Proportional term
        proportional = self.kp * error

        # Integral term
        self.integral += error * dt
        integral = self.ki * self.integral

        # Apply output limits to prevent windup
        if self.output_limits is not None:
            min_output, max_output = self.output_limits
            integral = max(min_output, min(max_output, integral))

        # Derivative term
        derivative = 0
        if dt > 0:
            derivative = self.kd * (error - self.last_error) / dt

        # Calculate output
        output = proportional + integral + derivative

        # Apply output limits
        if self.output_limits is not None:
            output = max(min_output, min(max_output, output))

        # Store current error for next derivative calculation
        self.last_error = error

        return output
```

### 5.2.2 Advanced Control Techniques

#### State-Space Control
```python
import numpy as np

class StateSpaceController:
    def __init__(self, A, B, C, D, Q, R):
        """
        Initialize state-space controller
        A, B, C, D: State-space matrices
        Q, R: Cost matrices for LQR
        """
        self.A = np.array(A)
        self.B = np.array(B)
        self.C = np.array(C)
        self.D = np.array(D)

        # Design LQR controller
        self.K = self.lqr_gain(A, B, Q, R)

        # State estimate
        self.x_hat = np.zeros((A.shape[0], 1))

    def lqr_gain(self, A, B, Q, R):
        """Calculate LQR gain matrix"""
        # Solve Riccati equation (simplified implementation)
        # In practice, use scipy.linalg.solve_continuous_are
        import scipy.linalg as la

        P = la.solve_continuous_are(A, B, Q, R)
        K = np.linalg.inv(R) @ B.T @ P

        return K

    def update(self, x_ref, y_measured):
        """Update controller with reference and measurement"""
        # State estimation (simplified - in practice use observer/Kalman filter)
        error = x_ref - self.x_hat
        u = -self.K @ error
        return u.flatten()
```

## 5.3 Motion Planning Algorithms

### 5.3.1 Path Planning

Path planning finds collision-free paths from start to goal configurations:

#### A* Algorithm Implementation
```python
import heapq
import numpy as np

class AStarPlanner:
    def __init__(self, grid_map):
        self.grid_map = grid_map  # 2D array where 0=free, 1=obstacle
        self.height, self.width = grid_map.shape

    def heuristic(self, a, b):
        """Calculate heuristic distance (Manhattan distance)"""
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    def get_neighbors(self, pos):
        """Get valid neighbors for a position"""
        x, y = pos
        neighbors = []

        # 4-connected neighbors
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nx, ny = x + dx, y + dy

            # Check bounds
            if 0 <= nx < self.width and 0 <= ny < self.height:
                # Check if not an obstacle
                if self.grid_map[ny, nx] == 0:
                    neighbors.append((nx, ny))

        return neighbors

    def plan_path(self, start, goal):
        """Plan path using A* algorithm"""
        # Priority queue: (f_score, g_score, position)
        open_set = [(0, 0, start)]
        closed_set = set()

        # g_score: cost from start to current position
        g_score = {start: 0}
        # came_from: path reconstruction
        came_from = {}

        while open_set:
            current_f, current_g, current = heapq.heappop(open_set)

            if current == goal:
                # Reconstruct path
                path = []
                while current in came_from:
                    path.append(current)
                    current = came_from[current]
                path.append(start)
                return path[::-1]  # Reverse to get start-to-goal path

            closed_set.add(current)

            for neighbor in self.get_neighbors(current):
                if neighbor in closed_set:
                    continue

                # Calculate tentative g_score
                tentative_g = current_g + 1

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    # This path to neighbor is better
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + self.heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score, tentative_g, neighbor))

        return None  # No path found
```

#### RRT (Rapidly-exploring Random Tree)
```python
class RRTPlanner:
    def __init__(self, bounds, obstacle_list):
        self.bounds = bounds  # (min_x, max_x, min_y, max_y)
        self.obstacles = obstacle_list
        self.tree = []
        self.goal_bias = 0.1  # Probability of sampling goal

    def is_collision_free(self, point):
        """Check if point is collision-free"""
        x, y = point
        min_x, max_x, min_y, max_y = self.bounds

        # Check bounds
        if not (min_x <= x <= max_x and min_y <= y <= max_y):
            return False

        # Check obstacles
        for obstacle in self.obstacles:
            ox, oy, radius = obstacle
            distance = np.sqrt((x - ox)**2 + (y - oy)**2)
            if distance < radius:
                return False

        return True

    def plan_path(self, start, goal, max_iterations=1000):
        """Plan path using RRT algorithm"""
        if not self.is_collision_free(start) or not self.is_collision_free(goal):
            return None

        self.tree = [start]
        path_to_goal = []

        for i in range(max_iterations):
            # Sample random point (with goal bias)
            if np.random.random() < self.goal_bias:
                rand_point = goal
            else:
                min_x, max_x, min_y, max_y = self.bounds
                rand_point = (
                    np.random.uniform(min_x, max_x),
                    np.random.uniform(min_y, max_y)
                )

            # Find nearest node in tree
            nearest_idx = self.find_nearest_node(rand_point)
            nearest_point = self.tree[nearest_idx]

            # Extend towards random point
            new_point = self.extend_towards(nearest_point, rand_point)

            if self.is_collision_free(new_point):
                self.tree.append(new_point)

                # Check if close to goal
                if self.distance(new_point, goal) < 0.5:
                    # Attempt to connect directly to goal
                    if self.is_collision_free(goal):
                        path_to_goal = self.reconstruct_path(len(self.tree) - 1)
                        path_to_goal.append(goal)
                        break

        return path_to_goal

    def find_nearest_node(self, point):
        """Find index of nearest node in tree to given point"""
        min_dist = float('inf')
        nearest_idx = 0

        for i, tree_point in enumerate(self.tree):
            dist = self.distance(point, tree_point)
            if dist < min_dist:
                min_dist = dist
                nearest_idx = i

        return nearest_idx

    def extend_towards(self, from_point, to_point, step_size=0.2):
        """Extend tree towards a point by step_size"""
        dx = to_point[0] - from_point[0]
        dy = to_point[1] - from_point[1]
        distance = np.sqrt(dx**2 + dy**2)

        if distance <= step_size:
            return to_point

        # Normalize and scale
        new_x = from_point[0] + (dx / distance) * step_size
        new_y = from_point[1] + (dy / distance) * step_size

        return (new_x, new_y)

    def distance(self, p1, p2):
        """Calculate Euclidean distance between two points"""
        return np.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

    def reconstruct_path(self, node_idx):
        """Reconstruct path from start to given node index"""
        path = []
        current_idx = node_idx

        # This is a simplified version - in practice you'd store parent indices
        # For a complete implementation, store parent relationships in the tree
        path.append(self.tree[current_idx])
        return path
```

### 5.3.2 Trajectory Planning

Trajectory planning generates time-parameterized paths with velocity and acceleration profiles:

#### Polynomial Trajectory Generation
```python
class PolynomialTrajectory:
    def __init__(self, start_pos, start_vel, end_pos, end_vel, duration):
        """
        Create 3rd order polynomial trajectory
        q(t) = a0 + a1*t + a2*t^2 + a3*t^3
        """
        self.start_pos = start_pos
        self.start_vel = start_vel
        self.end_pos = end_pos
        self.end_vel = end_vel
        self.duration = duration

        # Solve for polynomial coefficients
        # Boundary conditions:
        # q(0) = start_pos, q'(0) = start_vel
        # q(T) = end_pos, q'(T) = end_vel

        T = duration
        self.a0 = start_pos
        self.a1 = start_vel
        self.a2 = (3*(end_pos - start_pos) - T*(2*start_vel + end_vel)) / (T**2)
        self.a3 = (2*(start_pos - end_pos) + T*(start_vel + end_vel)) / (T**3)

    def position(self, t):
        """Get position at time t"""
        if t < 0:
            return self.start_pos
        elif t > self.duration:
            return self.end_pos
        else:
            return (self.a0 +
                   self.a1 * t +
                   self.a2 * t**2 +
                   self.a3 * t**3)

    def velocity(self, t):
        """Get velocity at time t"""
        if t < 0 or t > self.duration:
            return 0.0
        else:
            return (self.a1 +
                   2 * self.a2 * t +
                   3 * self.a3 * t**2)

    def acceleration(self, t):
        """Get acceleration at time t"""
        if t < 0 or t > self.duration:
            return 0.0
        else:
            return 2 * self.a2 + 6 * self.a3 * t
```

## 5.4 Manipulation Control

### 5.4.1 Inverse Kinematics

Inverse kinematics solves for joint angles to achieve desired end-effector poses:

#### Geometric Inverse Kinematics
```python
class InverseKinematics:
    def __init__(self, link_lengths):
        self.l1, self.l2 = link_lengths  # Lengths of two links

    def two_link_planar_ik(self, x, y):
        """
        Inverse kinematics for 2-link planar manipulator
        """
        # Distance from origin to target
        r = np.sqrt(x**2 + y**2)

        # Check if target is reachable
        if r > self.l1 + self.l2:
            # Target is out of reach - return closest position
            scale = (self.l1 + self.l2) / r
            x = x * scale
            y = y * scale
            r = np.sqrt(x**2 + y**2)
        elif r < abs(self.l1 - self.l2):
            # Target is inside workspace - not reachable
            return None

        # Calculate elbow-up solution
        cos_theta2 = (x**2 + y**2 - self.l1**2 - self.l2**2) / (2 * self.l1 * self.l2)
        sin_theta2 = np.sqrt(1 - cos_theta2**2)

        theta2 = np.arctan2(sin_theta2, cos_theta2)

        k1 = self.l1 + self.l2 * cos_theta2
        k2 = self.l2 * sin_theta2

        theta1 = np.arctan2(y, x) - np.arctan2(k2, k1)

        return np.array([theta1, theta2])

    def jacobian_ik(self, joint_angles, target_pos, end_effector_pos, max_iter=100, tolerance=1e-6):
        """
        Jacobian-based inverse kinematics
        """
        current_angles = joint_angles.copy()

        for i in range(max_iter):
            # Calculate current end-effector position
            current_pos = self.forward_kinematics(current_angles)

            # Calculate error
            error = target_pos - current_pos

            if np.linalg.norm(error) < tolerance:
                return current_angles

            # Calculate Jacobian
            J = self.calculate_jacobian(current_angles)

            # Calculate joint angle update using pseudo-inverse
            dtheta = np.linalg.pinv(J) @ error

            # Update joint angles
            current_angles += dtheta

        return current_angles

    def forward_kinematics(self, joint_angles):
        """Calculate end-effector position from joint angles"""
        theta1, theta2 = joint_angles

        x = self.l1 * np.cos(theta1) + self.l2 * np.cos(theta1 + theta2)
        y = self.l1 * np.sin(theta1) + self.l2 * np.sin(theta1 + theta2)

        return np.array([x, y])

    def calculate_jacobian(self, joint_angles):
        """Calculate Jacobian matrix for 2-link manipulator"""
        theta1, theta2 = joint_angles

        J = np.array([
            [-self.l1*np.sin(theta1) - self.l2*np.sin(theta1+theta2),
             -self.l2*np.sin(theta1+theta2)],
            [self.l1*np.cos(theta1) + self.l2*np.cos(theta1+theta2),
             self.l2*np.cos(theta1+theta2)]
        ])

        return J
```

### 5.4.2 Force Control

Force control allows robots to interact with their environment with controlled forces:

#### Impedance Control Implementation
```python
class ImpedanceController:
    def __init__(self, mass, damping, stiffness):
        """
        Impedance controller: M*d²x + B*dx + K*x = F
        where x is position error from desired trajectory
        """
        self.M = mass      # Desired mass (inertia)
        self.B = damping   # Desired damping
        self.K = stiffness # Desired stiffness

        # State variables
        self.position_error = 0
        self.velocity_error = 0
        self.last_error = 0
        self.last_time = None

    def update(self, desired_pos, actual_pos, desired_vel, actual_vel, dt=None):
        """Update impedance controller"""
        import time

        # Calculate time step
        current_time = time.time()
        if dt is None:
            if self.last_time is None:
                dt = 0.01
            else:
                dt = current_time - self.last_time
        self.last_time = current_time

        if dt <= 0:
            return 0

        # Calculate position and velocity errors
        self.position_error = desired_pos - actual_pos
        self.velocity_error = desired_vel - actual_vel

        # Calculate desired force based on impedance model
        acceleration = (self.position_error * self.K +
                       self.velocity_error * self.B) / self.M

        # Integrate to get velocity and position
        force = self.M * acceleration

        return force

class HybridForcePositionController:
    def __init__(self, position_gains, force_gains):
        self.position_controller = PIDController(*position_gains)
        self.force_controller = PIDController(*force_gains)

        # Selection matrix for task space (which directions for position vs force)
        self.selection_matrix = np.array([1, 1, 0, 0, 0, 0])  # Position in x,y; Force in z

    def update(self, position_error, force_error, dt=None):
        """Update hybrid controller"""
        position_cmd = self.position_controller.update(position_error, dt)
        force_cmd = self.force_controller.update(force_error, dt)

        # Combine commands based on selection matrix
        task_space_cmd = self.selection_matrix * position_cmd + (1 - self.selection_matrix) * force_cmd

        return task_space_cmd
```

## 5.5 Navigation and Mobile Robot Control

### 5.5.1 Differential Drive Control

```python
class DifferentialDriveController:
    def __init__(self, wheel_radius, wheel_base):
        self.wheel_radius = wheel_radius  # Radius of wheels
        self.wheel_base = wheel_base      # Distance between wheels

        # PID controllers for linear and angular velocity
        self.linear_controller = PIDController(1.0, 0.1, 0.05)
        self.angular_controller = PIDController(2.0, 0.1, 0.1)

    def follow_path(self, current_pose, target_pose, dt):
        """
        Follow a path using pure pursuit algorithm
        current_pose: (x, y, theta)
        target_pose: (x, y, theta)
        """
        x, y, theta = current_pose
        target_x, target_y, target_theta = target_pose

        # Calculate distance and angle to target
        dx = target_x - x
        dy = target_y - y
        distance = np.sqrt(dx**2 + dy**2)

        target_angle = np.arctan2(dy, dx)
        angle_error = target_angle - theta

        # Normalize angle error to [-pi, pi]
        while angle_error > np.pi:
            angle_error -= 2 * np.pi
        while angle_error < -np.pi:
            angle_error += 2 * np.pi

        # Calculate desired linear and angular velocities
        desired_linear = min(0.5, distance)  # Limit linear velocity
        desired_angular = self.angular_controller.update(angle_error, dt)

        # Apply limits
        desired_angular = max(-1.0, min(1.0, desired_angular))

        # Convert to wheel velocities
        left_wheel_vel = (desired_linear - desired_angular * self.wheel_base / 2) / self.wheel_radius
        right_wheel_vel = (desired_linear + desired_angular * self.wheel_base / 2) / self.wheel_radius

        return left_wheel_vel, right_wheel_vel

    def convert_to_wheel_velocities(self, linear_vel, angular_vel):
        """Convert linear and angular velocities to wheel velocities"""
        left_vel = (linear_vel - angular_vel * self.wheel_base / 2) / self.wheel_radius
        right_vel = (linear_vel + angular_vel * self.wheel_base / 2) / self.wheel_radius

        return left_vel, right_vel
```

### 5.5.2 Obstacle Avoidance

```python
class ObstacleAvoidance:
    def __init__(self, safe_distance=0.5, max_force=1.0):
        self.safe_distance = safe_distance
        self.max_force = max_force

    def calculate_repulsive_force(self, robot_pos, obstacles):
        """Calculate repulsive force from obstacles"""
        total_force = np.array([0.0, 0.0])

        for obs_pos, obs_radius in obstacles:
            # Vector from obstacle to robot
            direction = np.array(robot_pos) - np.array(obs_pos)
            distance = np.linalg.norm(direction)

            if distance < self.safe_distance + obs_radius:
                # Normalize direction
                if distance > 0:
                    direction = direction / distance

                # Calculate repulsive force (inverse to distance)
                force_magnitude = self.max_force * (1/(distance) - 1/(self.safe_distance + obs_radius))
                force_magnitude = max(0, min(self.max_force, force_magnitude))

                repulsive_force = force_magnitude * direction
                total_force += repulsive_force

        return total_force

    def calculate_attractive_force(self, robot_pos, goal_pos):
        """Calculate attractive force towards goal"""
        direction = np.array(goal_pos) - np.array(robot_pos)
        distance = np.linalg.norm(direction)

        if distance > 0:
            direction = direction / distance

        # Linear attractive force
        attractive_force = min(1.0, distance) * direction
        return attractive_force

    def potential_field_navigation(self, robot_pos, goal_pos, obstacles):
        """Combine attractive and repulsive forces"""
        attractive_force = self.calculate_attractive_force(robot_pos, goal_pos)
        repulsive_force = self.calculate_repulsive_force(robot_pos, obstacles)

        total_force = attractive_force + repulsive_force

        # Normalize and scale
        force_magnitude = np.linalg.norm(total_force)
        if force_magnitude > 0:
            total_force = total_force / force_magnitude
            total_force = min(1.0, force_magnitude) * total_force

        return total_force
```

<Callout type="tip">
**Best Practice:** Always implement safety limits and monitoring in control systems. Use multiple control strategies and fallback behaviors to ensure safe robot operation under various conditions.
</Callout>

## 5.6 Control System Integration

### 5.6.1 Real-time Control Architecture

```python
import threading
import time

class RobotController:
    def __init__(self):
        self.running = False
        self.control_thread = None

        # Initialize controllers
        self.joint_controllers = []  # PID controllers for each joint
        self.trajectory_planner = None
        self.safety_monitor = SafetyMonitor()

        # Robot state
        self.current_positions = []
        self.current_velocities = []
        self.desired_positions = []

    def start_control_loop(self, frequency=100):
        """Start the real-time control loop"""
        self.running = True
        self.control_thread = threading.Thread(
            target=self._control_loop,
            args=(1.0/frequency,)
        )
        self.control_thread.start()

    def _control_loop(self, dt):
        """Main control loop"""
        while self.running:
            start_time = time.time()

            # Read current sensor data
            self.current_positions = self.read_joint_positions()
            self.current_velocities = self.read_joint_velocities()

            # Check safety conditions
            if not self.safety_monitor.is_safe(self.current_positions, self.current_velocities):
                self.emergency_stop()
                continue

            # Update trajectory if needed
            if self.trajectory_planner:
                self.desired_positions = self.trajectory_planner.get_desired_state()

            # Calculate control commands
            control_commands = []
            for i, controller in enumerate(self.joint_controllers):
                error = self.desired_positions[i] - self.current_positions[i]
                command = controller.update(error, dt)
                control_commands.append(command)

            # Send commands to actuators
            self.send_commands(control_commands)

            # Sleep to maintain control frequency
            elapsed = time.time() - start_time
            sleep_time = max(0, dt - elapsed)
            time.sleep(sleep_time)

    def stop_control_loop(self):
        """Stop the control loop"""
        self.running = False
        if self.control_thread:
            self.control_thread.join()

class SafetyMonitor:
    def __init__(self):
        self.joint_limits = []  # [(min, max), ...] for each joint
        self.velocity_limits = []  # Max velocities for each joint
        self.collision_threshold = 0.1  # Minimum distance to obstacles

    def is_safe(self, positions, velocities):
        """Check if current state is safe"""
        # Check joint limits
        for i, (pos, limits) in enumerate(zip(positions, self.joint_limits)):
            if not (limits[0] <= pos <= limits[1]):
                return False

        # Check velocity limits
        for vel, limit in zip(velocities, self.velocity_limits):
            if abs(vel) > limit:
                return False

        return True

    def emergency_stop(self):
        """Trigger emergency stop"""
        # Implementation depends on robot hardware
        pass
```

---
**Chapter Summary**: This chapter explored robot control and planning systems, covering classical control techniques, motion planning algorithms, manipulation control, and navigation systems. We examined PID control, path planning algorithms like A* and RRT, trajectory generation, inverse kinematics, and force control methods. Effective control systems are essential for robot performance, requiring careful design to balance stability, performance, and safety. The integration of planning and control enables robots to execute complex tasks reliably and safely.
